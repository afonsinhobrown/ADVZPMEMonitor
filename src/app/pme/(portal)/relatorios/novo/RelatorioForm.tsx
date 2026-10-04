'use client';

import { useActionState, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { submitQuarterlyReport, type ReportFormState } from '@/app/pme/actions';
import {
  ACCEPTED_EVIDENCE_EXTENSIONS,
  MAX_EVIDENCE_BYTES,
  MAX_EVIDENCE_FILES,
  formatBytes,
} from '@/lib/evidence';
import { formatMZN } from '@/lib/format';
import { Notice, Panel } from '@/app/pme/components';

type Category = {
  id: string;
  name: string;
  allocatedAmount: number;
  alreadyCommitted: number;
};

type Subproject = {
  id: string;
  name: string;
  agreementNumber: string;
  categories: Category[];
};

type ExpenseRow = {
  key: string;
  description: string;
  amount: string;
  date: string;
  categoryId: string;
};

type PeriodOption = {
  value: string;
  label: string;
  deadline: string;
};

const TOLERANCE = 0.005;

let rowCounter = 0;
function emptyRow(): ExpenseRow {
  rowCounter += 1;
  return { key: `linha-${rowCounter}`, description: '', amount: '', date: '', categoryId: '' };
}

function toNumber(value: string): number {
  const parsed = Number.parseFloat(value.replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function RelatorioForm({
  reportId,
  locked,
  lockedPeriod,
  subprojects,
  defaultSubprojectId,
  defaultPeriod,
  periodOptions,
  deadlineLabel,
  initialValues,
  initialExpenses,
}: {
  reportId: string | null;
  locked: boolean;
  lockedPeriod: boolean;
  subprojects: Subproject[];
  defaultSubprojectId: string;
  defaultPeriod: string;
  periodOptions: PeriodOption[];
  deadlineLabel: string;
  initialValues: {
    mainActivity: string;
    progressDescription: string;
    challenges: string;
    safeguardsNotes: string;
  };
  initialExpenses: ExpenseRow[];
}) {
  const [state, formAction, pending] = useActionState(submitQuarterlyReport, {} as ReportFormState);
  const router = useRouter();

  const [period, setPeriod] = useState(defaultPeriod);
  const [rows, setRows] = useState<ExpenseRow[]>(initialExpenses);

  const subproject = useMemo(
    () => subprojects.find((item) => item.id === defaultSubprojectId) ?? subprojects[0],
    [defaultSubprojectId, subprojects]
  );

  const rowsByCategory = useMemo(() => {
    const totals = new Map<string, number>();
    for (const row of rows) {
      const value = toNumber(row.amount);
      if (value <= 0) continue;
      totals.set(row.categoryId, (totals.get(row.categoryId) ?? 0) + value);
    }
    return totals;
  }, [rows]);

  const budget = useMemo(
    () =>
      subproject.categories.map((category) => {
        const declared = rowsByCategory.get(category.id) ?? 0;
        const projected = category.alreadyCommitted + declared;
        return {
          ...category,
          declared,
          projected,
          over: category.allocatedAmount > 0 && projected > category.allocatedAmount + TOLERANCE,
        };
      }),
    [subproject.categories, rowsByCategory]
  );

  const totalDeclared = useMemo(
    () => rows.reduce((total, row) => total + toNumber(row.amount), 0),
    [rows]
  );

  const breaches = budget.filter((row) => row.over);
  const serverBreaches = state.budgetBreaches ?? [];

  const updateRow = (key: string, patch: Partial<ExpenseRow>) => {
    setRows((current) => current.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  };

  const reload = (next: { subprojectId?: string; period?: string }) => {
    const params = new URLSearchParams();
    if (reportId) params.set('id', reportId);
    params.set('subprojectId', next.subprojectId ?? defaultSubprojectId);
    params.set('period', next.period ?? period);
    router.push(`/pme/relatorios/novo?${params.toString()}`);
  };

  return (
    <form action={formAction}>
      <input type="hidden" name="reportId" value={reportId ?? ''} />

      {state.error && (
        <Notice tone="danger" title="Não foi possível gravar o relatório">
          {state.error}
        </Notice>
      )}

      {serverBreaches.length > 0 && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <strong style={{ display: 'block', color: '#b91c1c', fontSize: '0.95rem' }}>
            Excedeu o orçamento aprovado nesta rubrica
          </strong>
          <p style={{ margin: '0.35rem 0 0.75rem 0', fontSize: '0.88rem', color: '#b91c1c' }}>
            Ajuste as despesas declaradas. O relatório só é submetido se os montos não ultrapassarem o
            orçamento aprovado.
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.88rem', color: '#7f1d1d' }}>
            {serverBreaches.map((breach) => (
              <li key={breach.category} style={{ marginBottom: '0.25rem' }}>
                <strong>{breach.category}</strong>: {formatMZN(breach.spent)} MZN declarados para um
                orçamento de {formatMZN(breach.allocated)} MZN.
              </li>
            ))}
          </ul>
        </div>
      )}

      <Panel title="Identificação do relatório">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <Field
            label="Projecto financiado"
            hint="Ao mudar de projecto o formulário é recarregado com a rubrica correcta."
          >
            <select
              name="subprojectId"
              className="input"
              value={defaultSubprojectId}
              disabled={locked}
              onChange={(event) => reload({ subprojectId: event.target.value })}
            >
              {subprojects.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.agreementNumber})
                </option>
              ))}
            </select>
          </Field>

          <Field label="Período do relatório" hint={`Prazo limite de submissão: ${deadlineLabel}`}>
            <select
              name="period"
              className="input"
              value={period}
              disabled={lockedPeriod}
              onChange={(event) => {
                setPeriod(event.target.value);
                reload({ period: event.target.value });
              }}
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {subproject.categories.length === 0 && (
          <Notice tone="warning" title="Orçamento não configurado">
            Este projecto ainda não tem rubricas orçamentais definidas pela Agência. Contacte o técnico
            responsável para que as rubricas sejam criadas antes de submeter despesas.
          </Notice>
        )}
      </Panel>

      <Panel title="Actividade e progresso">
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <Field label="Actividade principal realizada" error={state.fieldErrors?.mainActivity} required>
            <input
              type="text"
              name="mainActivity"
              className="input"
              defaultValue={initialValues.mainActivity}
              disabled={locked}
              placeholder="Ex: Instalação do sistema de irrigação no sector B"
            />
          </Field>

          <Field
            label="Descrição detalhada do progresso físico"
            error={state.fieldErrors?.progressDescription}
            required
            hint="Marcos atingidos, quantidades executadas, metodologia aplicada e responsável."
          >
            <textarea
              name="progressDescription"
              className="input"
              rows={6}
              defaultValue={initialValues.progressDescription}
              disabled={locked}
              placeholder="Descreva pormenorizadamente o que foi executado no trimestre…"
            />
          </Field>

          <Field
            label="Desvios ou desafios encontrados"
            hint="Atrasos, ruturas de stock, dificuldades técnicas, condicionantes ambientais."
          >
            <textarea
              name="challenges"
              className="input"
              rows={3}
              defaultValue={initialValues.challenges}
              disabled={locked}
              placeholder={'Se não houver desvios, escreva "Nenhum".'}
            />
          </Field>

          <Field
            label="Impacto social e ambiental (salvaguardas)"
            hint="Medidas de mitigação, contratação de mão-de-obra local, gestão de resíduos."
          >
            <textarea
              name="safeguardsNotes"
              className="input"
              rows={3}
              defaultValue={initialValues.safeguardsNotes}
              disabled={locked}
              placeholder="Detalhe as medidas tomadas no trimestre…"
            />
          </Field>
        </div>
      </Panel>

      <Panel
        title="Despesas do trimestre"
        description="Cada despesa é imputada a uma rubrica do orçamento aprovado e validada automaticamente."
      >
        {subproject.categories.length === 0 ? (
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
            Sem rubricas orçamentais não é possível declarar despesas. Pode ainda assim submeter o relatório
            narrativo.
          </p>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '880px' }}>
                <thead>
                  <tr>
                    {['Descrição', 'Rubrica', 'Data', 'Valor (MZN)', ''].map((column) => (
                      <th
                        key={column}
                        style={{
                          textAlign: 'left',
                          color: '#64748b',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.6px',
                          padding: '0 0.75rem 0.75rem 0',
                          borderBottom: '1px solid #e2e8f0',
                        }}
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => {
                    const check = budget.find((item) => item.id === row.categoryId);

                    return (
                      <tr key={row.key}>
                        <td style={{ padding: '0.6rem 0.75rem 0.6rem 0', minWidth: '240px' }}>
                          <input
                            type="text"
                            name="expenseDescription"
                            className="input"
                            style={{ padding: '0.6rem 0.85rem' }}
                            value={row.description}
                            onChange={(event) => updateRow(row.key, { description: event.target.value })}
                            disabled={locked}
                            placeholder="Ex: Compra de material de irrigação"
                            aria-label={`Descrição da despesa ${index + 1}`}
                          />
                          {state.expenseErrors?.[String(index)] && (
                            <span
                              style={{
                                color: '#b91c1c',
                                fontSize: '0.75rem',
                                display: 'block',
                                marginTop: '0.25rem',
                              }}
                            >
                              {state.expenseErrors[String(index)]}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '0.6rem 0.75rem 0.6rem 0', minWidth: '220px' }}>
                          <select
                            name="expenseCategory"
                            className="input"
                            style={{ padding: '0.6rem 0.85rem' }}
                            value={row.categoryId}
                            onChange={(event) => updateRow(row.key, { categoryId: event.target.value })}
                            disabled={locked}
                            aria-label={`Rubrica da despesa ${index + 1}`}
                          >
                            <option value="">Seleccionar…</option>
                            {subproject.categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name} — {formatMZN(category.allocatedAmount)} MZN
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: '0.6rem 0.75rem 0.6rem 0' }}>
                          <input
                            type="date"
                            name="expenseDate"
                            className="input"
                            style={{ padding: '0.6rem 0.85rem' }}
                            value={row.date}
                            onChange={(event) => updateRow(row.key, { date: event.target.value })}
                            disabled={locked}
                            aria-label={`Data da despesa ${index + 1}`}
                          />
                        </td>
                        <td style={{ padding: '0.6rem 0.75rem 0.6rem 0', minWidth: '160px' }}>
                          <input
                            type="text"
                            inputMode="decimal"
                            name="expenseAmount"
                            className="input"
                            style={{
                              padding: '0.6rem 0.85rem',
                              borderColor: check?.over ? '#ef4444' : undefined,
                            }}
                            value={row.amount}
                            onChange={(event) => updateRow(row.key, { amount: event.target.value })}
                            disabled={locked}
                            placeholder="0,00"
                            aria-label={`Valor da despesa ${index + 1}`}
                          />
                          {check?.over && (
                            <span
                              style={{
                                color: '#b91c1c',
                                fontSize: '0.72rem',
                                display: 'block',
                                marginTop: '0.25rem',
                              }}
                            >
                              Rubrica excedida em {formatMZN(check.projected - check.allocatedAmount)} MZN
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '0.6rem 0' }}>
                          <button
                            type="button"
                            onClick={() =>
                              setRows((current) =>
                                current.length === 1 ? [emptyRow()] : current.filter((item) => item.key !== row.key)
                              )
                            }
                            disabled={locked}
                            style={{
                              border: '1px solid #fecaca',
                              background: '#fef2f2',
                              color: '#b91c1c',
                              borderRadius: '8px',
                              width: '34px',
                              height: '34px',
                              cursor: locked ? 'not-allowed' : 'pointer',
                              fontWeight: 700,
                              fontSize: '1.1rem',
                              lineHeight: 1,
                            }}
                            aria-label={`Remover despesa ${index + 1}`}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '1.25rem',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                onClick={() => setRows((current) => [...current, emptyRow()])}
                disabled={locked}
                className="btn btn-secondary"
              >
                + Adicionar despesa
              </button>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>
                  Total declarado no relatório
                </span>
                <strong style={{ fontSize: '1.35rem', color: '#0f172a' }}>
                  {formatMZN(totalDeclared)} MZN
                </strong>
              </div>
            </div>

            {breaches.length > 0 && (
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '1rem',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '10px',
                  color: '#b91c1c',
                  fontSize: '0.85rem',
                }}
              >
                <strong>Orçamento excedido</strong>
                <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem' }}>
                  {breaches.map((row) => (
                    <li key={row.id} style={{ marginBottom: '0.25rem' }}>
                      {row.name}: {formatMZN(row.projected)} MZN para um orçamento de{' '}
                      {formatMZN(row.allocatedAmount)} MZN.
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </Panel>

      <Panel
        title="Evidências"
        description={`Anexe comprovativos (facturas, recibos, fotografias). Até ${MAX_EVIDENCE_FILES} ficheiros, ${formatBytes(MAX_EVIDENCE_BYTES)} cada.`}
      >
        <label
          htmlFor="evidencias"
          style={{
            display: 'block',
            padding: '2rem',
            border: '2px dashed #cbd5e1',
            borderRadius: '12px',
            background: '#f8fafc',
            textAlign: 'center',
            cursor: locked ? 'not-allowed' : 'pointer',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
          <div style={{ fontWeight: 700, color: '#0f172a' }}>
            Clique para seleccionar os ficheiros
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
            PDF, JPG, PNG, WEBP, XLS ou XLSX
          </div>
          <input
            id="evidencias"
            type="file"
            name="evidencias"
            multiple
            accept={ACCEPTED_EVIDENCE_EXTENSIONS}
            disabled={locked}
            style={{ display: 'none' }}
          />
        </label>
        <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
          A submissão exige pelo menos uma evidência. Pode guardar o rascunho sem anexos e continuar depois.
        </p>
      </Panel>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          type="submit"
          name="intent"
          value="draft"
          disabled={pending || locked}
          className="btn btn-secondary"
          style={{ padding: '0.85rem 1.75rem' }}
        >
          {pending ? 'A processar…' : 'Guardar rascunho'}
        </button>
        <button
          type="submit"
          name="intent"
          value="submit"
          disabled={pending || locked || breaches.length > 0}
          className="btn btn-primary"
          style={{ padding: '0.85rem 2rem' }}
        >
          {pending ? 'A processar…' : 'Submeter relatório oficial'}
        </button>
      </div>

      {locked && (
        <p style={{ marginTop: '1rem', textAlign: 'right' }}>
          <Link href="/pme/relatorios" style={{ color: '#166534', fontWeight: 700, fontSize: '0.88rem' }}>
            Voltar aos relatórios
          </Link>
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  children,
  error,
  hint,
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: '#334155',
          marginBottom: '0.4rem',
        }}
      >
        {label}
        {required && <span style={{ color: '#ef4444' }}> *</span>}
      </label>
      {children}
      {hint && !error && (
        <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>{hint}</p>
      )}
      {error && (
        <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.78rem', color: '#b91c1c', fontWeight: 600 }}>
          {error}
        </p>
      )}
    </div>
  );
}