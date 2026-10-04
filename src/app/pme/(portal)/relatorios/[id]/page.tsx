import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getPmeUser } from '@/lib/auth';
import { deleteQuarterlyReport, removeReportEvidence } from '@/app/pme/actions';
import { REPORT_STATUS, canEditReport, formatDate, formatDateTime } from '@/lib/format';
import { formatBytes } from '@/lib/evidence';
import { periodShortLabel } from '@/lib/quarter';
import { DataTable, Money, Notice, Panel, StatusBadge } from '@/app/pme/components';

const NOTICES: Record<string, { tone: 'success' | 'warning' | 'danger' | 'info'; title: string }> = {
  rascunho: { tone: 'info', title: 'Rascunho guardado com sucesso.' },
  bloqueado: {
    tone: 'danger',
    title: 'Este relatório já foi submetido e está em análise. Não pode ser alterado nem eliminado.',
  },
};

export default async function PmeReportDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getPmeUser();
  if (!user?.pme) redirect('/pme/login');

  const { id } = await params;
  const { aviso } = await searchParams;

  const report = await prisma.quarterlyReport.findFirst({
    where: { id, subproject: { pmeId: user.pme.id } },
    include: {
      subproject: {
        include: { budgetCategories: { orderBy: { name: 'asc' } } },
      },
      expenses: { include: { category: { select: { name: true } } }, orderBy: { date: 'asc' } },
      attachments: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!report) notFound();

  const notice = typeof aviso === 'string' ? NOTICES[aviso] : null;
  const editable = canEditReport(report.status);
  const categoryName = new Map(report.subproject.budgetCategories.map((c) => [c.id, c.name]));
  const statusMeta = REPORT_STATUS[report.status];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          href="/pme/relatorios"
          style={{ color: '#166534', fontWeight: 700, fontSize: '0.88rem' }}
        >
          ← Voltar aos relatórios
        </Link>
      </div>

      <Panel
        title={`${report.subproject.name} · ${periodShortLabel(report.period)}`}
        description={`Acordo ${report.subproject.agreementNumber} · ${report.subproject.location}`}
        action={
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <StatusBadge status={report.status} />
            {editable && (
              <Link
                href={`/pme/relatorios/novo?id=${report.id}`}
                className="btn btn-primary"
                style={{ padding: '0.5rem 1rem' }}
              >
                Continuar rascunho
              </Link>
            )}
          </div>
        }
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <p style={labelStyle}>Fundos utilizados</p>
            <p style={valueStyle}>
              <Money value={report.fundsUsed} /> <span style={unitStyle}>MZN</span>
            </p>
          </div>
          <div>
            <p style={labelStyle}>Submetido em</p>
            <p style={valueStyle}>{formatDateTime(report.submissionDate)}</p>
          </div>
          <div>
            <p style={labelStyle}>Última actualização</p>
            <p style={valueStyle}>{formatDateTime(report.updatedAt)}</p>
          </div>
          <div>
            <p style={labelStyle}>Validado pela Agência</p>
            <p style={valueStyle}>{formatDate(report.reviewedAt)}</p>
          </div>
        </div>

        <p
          style={{
            padding: '0.85rem 1rem',
            background: statusMeta.bg,
            color: statusMeta.fg,
            borderRadius: '10px',
            fontSize: '0.88rem',
            fontWeight: 600,
          }}
        >
          {statusMeta.hint}
        </p>

        {report.reviewNotes && (
          <div style={{ marginTop: '1.25rem' }}>
            <Notice tone="danger" title="Notas da revisão técnica">
              {report.reviewNotes}
            </Notice>
          </div>
        )}

        <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1.5rem' }}>
          <Field label="Actividade principal realizada" value={report.mainActivity} />
          <Field label="Descrição do progresso físico" value={report.progressDescription} multiline />
          <Field label="Desvios ou desafios encontrados" value={report.challenges} />
          <Field label="Impacto social e ambiental (salvaguardas)" value={report.safeguardsNotes} />
        </div>
      </Panel>

      <Panel title="Despesas declaradas" description={`${report.expenses.length} registo(s) neste relatório`}>
        {report.expenses.length === 0 ? (
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
            Este relatório não contém despesas.
          </p>
        ) : (
          <DataTable head={['Data', 'Descrição', 'Rubrica', 'Valor (MZN)']}>
            {report.expenses.map((expense) => (
              <tr key={expense.id}>
                <td style={{ padding: '0.75rem 1rem 0.75rem 0', whiteSpace: 'nowrap', color: '#64748b' }}>
                  {formatDate(expense.date)}
                </td>
                <td style={{ padding: '0.75rem 1rem 0.75rem 0', color: '#0f172a', fontWeight: 600 }}>
                  {expense.description}
                </td>
                <td style={{ padding: '0.75rem 1rem 0.75rem 0', color: '#64748b' }}>
                  {categoryName.get(expense.categoryId) ?? expense.category.name}
                </td>
                <td style={{ padding: '0.75rem 0', fontWeight: 700 }}>
                  <Money value={expense.amount} />
                </td>
              </tr>
            ))}
          </DataTable>
        )}
      </Panel>

      <Panel
        title="Evidências anexadas"
        description={`${report.attachments.length} ficheiro(s)`}
      >
        {report.attachments.length === 0 ? (
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
            Não foram anexadas evidências a este relatório.
          </p>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '0.75rem' }}>
            {report.attachments.map((attachment) => (
              <li
                key={attachment.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.85rem 1rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <a
                    href={attachment.fileUrl}
                    style={{ color: '#166534', fontWeight: 700, fontSize: '0.9rem' }}
                  >
                    {attachment.fileName}
                  </a>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    {formatBytes(attachment.size)} · enviado em {formatDate(attachment.createdAt)}
                  </div>
                </div>
                {editable && (
                  <form action={removeReportEvidence}>
                    <input type="hidden" name="attachmentId" value={attachment.id} />
                    <button
                      type="submit"
                      style={{
                        background: 'none',
                        border: '1px solid #fecaca',
                        color: '#b91c1c',
                        borderRadius: '8px',
                        padding: '0.4rem 0.8rem',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      Remover
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {notice && <Notice tone={notice.tone} title={notice.title} />}

      {editable && (
        <form action={deleteQuarterlyReport}>
          <input type="hidden" name="reportId" value={report.id} />
          <button
            type="submit"
            className="btn"
            style={{
              background: '#fef2f2',
              color: '#b91c1c',
              border: '1px solid #fecaca',
            }}
          >
            Eliminar relatório
          </button>
        </form>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  margin: 0,
  color: '#64748b',
  fontSize: '0.72rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
};

const valueStyle: React.CSSProperties = {
  margin: '0.35rem 0 0 0',
  fontSize: '1.05rem',
  fontWeight: 800,
  color: '#0f172a',
};

const unitStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: '#94a3b8',
  fontWeight: 600,
};

function Field({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string | null;
  multiline?: boolean;
}) {
  if (!value) return null;

  return (
    <div>
      <p style={{ ...labelStyle, textTransform: 'none', letterSpacing: 0, fontSize: '0.85rem' }}>{label}</p>
      <p
        style={{
          margin: '0.35rem 0 0 0',
          color: '#334155',
          fontSize: '0.92rem',
          lineHeight: 1.7,
          whiteSpace: multiline ? 'normal' : undefined,
        }}
      >
        {value}
      </p>
    </div>
  );
}