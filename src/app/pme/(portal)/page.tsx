import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getPmeUser } from '@/lib/auth';
import { addActivity, removeActivity, savePlanDraft, submitActivityPlan } from '@/app/pme/actions';
import PmeProjectList from './PmeProjectList';
import {
  currentQuarter,
  daysUntil,
isPastDeadline,
  monthsBetween,
  periodKey,
  periodOrder,
  quarterDeadline,
} from '@/lib/quarter';
import { formatDate, formatMZN, percentage } from '@/lib/format';
import {
  DataTable,
  EmptyState,
  Money,
  Notice,
  Panel,
  ProgressBar,
  ProjectStatusBadge,
  StatCard,
  StatusBadge,
} from '@/app/pme/components';

const COUNTED_STATUSES = ['SUBMITTED', 'IN_REVIEW', 'APPROVED'] as const;

export default async function PmeDashboard() {
  const user = await getPmeUser();
  if (!user?.pme) redirect('/pme/login');

  const subprojects = await prisma.subproject.findMany({
    where: { pmeId: user.pme.id },
    orderBy: { startDate: 'asc' },
    include: {
      budgetCategories: { orderBy: { name: 'asc' } },
      activities: { orderBy: { order: 'asc' } },
      disbursements: { orderBy: { scheduledDate: 'asc' } },
      reports: {
        include: {
          expenses: { select: { amount: true, categoryId: true } },
          attachments: { select: { id: true } },
        },
      },
    },
  });

  const now = new Date();
  const today = currentQuarter(now);
  const todayPeriod = periodKey(today.quarter, today.year);
  const deadline = quarterDeadline(today.quarter, today.year);

  const isCounted = (status: string) =>
    (COUNTED_STATUSES as readonly string[]).includes(status);

  const totals = subprojects.reduce(
    (accumulator, subproject) => {
      const budget = subproject.budgetCategories.reduce((sum, category) => sum + category.allocatedAmount, 0);
      const spent = subproject.reports
        .filter((report) => isCounted(report.status))
        .flatMap((report) => report.expenses)
        .reduce((sum, expense) => sum + expense.amount, 0);

      const pending = subproject.reports
        .filter((report) => ['DRAFT', 'RETURNED'].includes(report.status))
        .reduce((sum, report) => sum + (report.expenses.length > 0 ? 1 : 0), 0);

      return {
        budget: accumulator.budget + budget,
        spent: accumulator.spent + spent,
        pending: accumulator.pending + pending,
      };
    },
    { budget: 0, spent: 0, pending: 0 }
  );

  const recentReports = subprojects
    .flatMap((subproject) =>
      subproject.reports.map((report) => ({ ...report, subprojectName: subproject.name }))
    )
    .sort((a, b) => {
      const byPeriod = periodOrder(b.period) - periodOrder(a.period);
      if (byPeriod !== 0) return byPeriod;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    })
    .slice(0, 5);

  const missingThisQuarter = subprojects.filter(
    (subproject) =>
      !subproject.reports.some((report) => report.period === todayPeriod && isCounted(report.status))
  );

  const overdueBy = daysUntil(deadline, now);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '1.5rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            Olá, {user.pme.name}
          </h1>
          <p style={{ margin: '0.35rem 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>
            Acompanhe a execução dos seus projectos e submeta os relatórios trimestrais.
          </p>
        </div>
        <Link href="/pme/relatorios/novo" className="btn btn-primary" id="pme-submit-report">
          Submeter relatório trimestral
        </Link>
      </div>

      {subprojects.length === 0 ? (
        <Panel>
          <EmptyState
            title="Ainda não tem projectos atribuídos"
            description="Assim que a Agência de Desenvolvimento do Vale do Zambeze registrar um projecto financiado para a sua empresa, ele aparecerá aqui com o orçamento, os prazos e o formulário de reporte trimestral."
          />
        </Panel>
      ) : (
        <>
          <PmeProjectList projects={subprojects} />
          {missingThisQuarter.length > 0 && (
            <Notice
              tone={isPastDeadline(deadline, now) ? 'danger' : 'warning'}
              title={
                isPastDeadline(deadline, now)
                  ? `Prazo de submissão de ${todayPeriod} expirou há ${Math.abs(overdueBy)} dia(s)`
                  : `Faltam ${overdueBy} dia(s) para submeter o relatório de ${todayPeriod}`
              }
            >
              {missingThisQuarter.length === 1
                ? `O projecto "${missingThisQuarter[0].name}" ainda não tem relatório submetido para o trimestre actual.`
                : `${missingThisQuarter.length} projectos ainda não têm relatório submetido para o trimestre actual.`}{' '}
              <Link href="/pme/relatorios/novo" style={{ fontWeight: 700, textDecoration: 'underline' }}>
                Submeter agora
              </Link>
              .
            </Notice>
          )}

          {totals.pending > 0 && (
            <Notice tone="info" title={`${totals.pending} relatório(s) por concluir`}>
              Tem relatórios em rascunho ou devolvidos pela Agência que ainda precisam de ser corrigidos e
              submetidos.{' '}
              <Link href="/pme/relatorios" style={{ fontWeight: 700, textDecoration: 'underline' }}>
                Ver relatórios
              </Link>
              .
            </Notice>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            <StatCard label="Orçamento Aprovado" value={formatMZN(totals.budget)} unit="MZN" accent="#0f172a" />
            <StatCard
              label="Executado (submetido)"
              value={formatMZN(totals.spent)}
              unit="MZN"
              accent="#1d4ed8"
              hint={`${percentage(totals.spent, totals.budget).toFixed(1)}% do orçamento total`}
            />
            <StatCard
              label="Saldo Disponível"
              value={formatMZN(Math.max(0, totals.budget - totals.spent))}
              unit="MZN"
              accent="#166534"
              hint="Após expenses submetidos à Agência"
            />
            <StatCard
              label="Prazo de Submissão"
              value={isPastDeadline(deadline, now) ? 'Expirado' : `${overdueBy} dias`}
              accent={isPastDeadline(deadline, now) ? '#b91c1c' : '#166534'}
              hint={`${todayPeriod} · até ${formatDate(deadline)}`}
            />
          </div>

          {subprojects.map((subproject) => {
            const totalMonths = monthsBetween(subproject.startDate, subproject.endDate);
            const elapsedMonths = Math.min(
              totalMonths,
              Math.max(0, monthsBetween(subproject.startDate, now))
            );
            const timePct = percentage(elapsedMonths, totalMonths);

            const spentByCategory = new Map<string, number>();
            let projectSpent = 0;

            for (const report of subproject.reports) {
              if (!isCounted(report.status)) continue;
              for (const expense of report.expenses) {
                projectSpent += expense.amount;
                spentByCategory.set(
                  expense.categoryId,
                  (spentByCategory.get(expense.categoryId) ?? 0) + expense.amount
                );
              }
            }

            const nextDisbursement = subproject.disbursements.find((item) => item.status === 'PENDING');

            return (
              <Panel
                key={subproject.id}
                title={subproject.name}
                description={`Acordo ${subproject.agreementNumber} · ${subproject.location}`}
                action={<ProjectStatusBadge status={subproject.status} />}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '2rem',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.82rem',
                        color: '#64748b',
                        marginBottom: '0.4rem',
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>Execução financeira</span>
                      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {formatMZN(projectSpent)} / {formatMZN(subproject.totalBudget)} MZN
                      </span>
                    </div>
                    <ProgressBar value={projectSpent} total={subproject.totalBudget} color="#3b82f6" />
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                      {percentage(projectSpent, subproject.totalBudget).toFixed(1)}% consumido
                    </p>
                  </div>

                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.82rem',
                        color: '#64748b',
                        marginBottom: '0.4rem',
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>Tempo de execução</span>
                      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {formatDate(subproject.startDate)} → {formatDate(subproject.endDate)}
                      </span>
                    </div>
                    <ProgressBar value={elapsedMonths} total={totalMonths} color="#22a039" />
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                      {elapsedMonths} de {totalMonths} meses · {timePct.toFixed(0)}% do prazo
                    </p>
                  </div>
                </div>

                {nextDisbursement && (
                  <p
                    style={{
                      margin: '1.5rem 0 0 0',
                      padding: '0.85rem 1rem',
                      background: '#f0f9ff',
                      border: '1px solid #bae6fd',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      color: '#075985',
                    }}
                  >
                    Próximo desembolso: <strong>{formatMZN(nextDisbursement.amount)} MZN</strong> ·{' '}
                    {nextDisbursement.phase} · previsto para {formatDate(nextDisbursement.scheduledDate)}
                  </p>
                )}

                <div
                  style={{
                    marginTop: '1.5rem',
                    padding: '1rem 1.25rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    background: '#f8fafc',
                  }}
                >
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 700, color: '#0f172a' }}>Plano de Actividades</p>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: '#475569' }}>
                    Estado: <strong>{subproject.planStatus === 'DRAFT' ? 'Rascunho' : subproject.planStatus === 'PENDING' ? 'Submetido (em análise)' : subproject.planStatus === 'APPROVED' ? 'Aprovado' : 'Devolvido'}</strong>
                    {subproject.planSubmittedAt ? ` · submetido em ${formatDate(subproject.planSubmittedAt)}` : ''}
                  </p>
                  {subproject.planStatus === 'RETURNED' && subproject.planReviewNotes && (
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: '#b91c1c' }}>
                      Devolvido pela ADVZ: {subproject.planReviewNotes}
                    </p>
                  )}
                  {subproject.planStatus === 'APPROVED' && (
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>
                      Plano aprovado pela ADVZ.
                    </p>
                  )}
                  {subproject.activities.length > 0 && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                          <th style={{ padding: '0.4rem 0' }}>Actividade</th>
                          <th>Responsável</th>
                          <th>Início</th>
                          <th>Fim</th>
                          <th>Orçamento</th>
                          {(subproject.planStatus === 'DRAFT' || subproject.planStatus === 'RETURNED') && <th></th>}
                        </tr>
                      </thead>
                      <tbody>
                        {subproject.activities.map(a => (
                          <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '0.5rem 0' }}>{a.description}</td>
                            <td>{a.responsible || '-'}</td>
                            <td>{a.startDate ? formatDate(a.startDate) : '-'}</td>
                            <td>{a.endDate ? formatDate(a.endDate) : '-'}</td>
                            <td>{a.budget != null ? formatMZN(a.budget) : '-'}</td>
                            {(subproject.planStatus === 'DRAFT' || subproject.planStatus === 'RETURNED') && (
                              <td>
                                <form action={removeActivity}>
                                  <input type="hidden" name="activityId" value={a.id} />
                                  <button type="submit" style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', fontSize: '0.8rem' }}>Remover</button>
                                </form>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {(subproject.planStatus === 'DRAFT' || subproject.planStatus === 'RETURNED') && (
                    <form action={addActivity} style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: '1rem' }}>
                      <input type="hidden" name="subprojectId" value={subproject.id} />
                      <input className="form-input" name="description" placeholder="Descrição da actividade *" required />
                      <input className="form-input" name="responsible" placeholder="Responsável" />
                      <input className="form-input" name="startDate" type="date" />
                      <input className="form-input" name="endDate" type="date" />
                      <input className="form-input" name="budget" type="number" step="0.01" placeholder="Orçamento (MT)" />
                      <input className="form-input" name="indicator" placeholder="Indicador" />
                      <button type="submit" className="btn btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>+ Adicionar actividade</button>
                    </form>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <form action={savePlanDraft.bind(null, subproject.id)}>
                      <button type="submit" className="btn btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>Guardar rascunho</button>
                    </form>
                    <form action={submitActivityPlan.bind(null, subproject.id)}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>Submeter plano</button>
                    </form>
                  </div>
                </div>

                {subproject.budgetCategories.length > 0 && (
                  <details style={{ marginTop: '1.5rem' }}>
                    <summary
                      style={{
                        cursor: 'pointer',
                        fontWeight: 700,

                        fontSize: '0.9rem',
                        color: '#166534',
                      }}
                    >
                      Ver execução por rubrica orçamental
                    </summary>
                    <div style={{ marginTop: '1rem' }}>
                      <DataTable
                        head={['Rubrica', 'Alocado', 'Executado', 'Saldo', '%']}
                      >
                        {subproject.budgetCategories.map((category) => {
                          const spent = spentByCategory.get(category.id) ?? 0;
                          const pct = percentage(spent, category.allocatedAmount);
                          return (
                            <tr key={category.id}>
                              <td style={{ padding: '0.75rem 1rem 0.75rem 0', fontWeight: 600, color: '#0f172a' }}>
                                {category.name}
                              </td>
                              <td style={{ padding: '0.75rem 1rem 0.75rem 0' }}>
                                <Money value={category.allocatedAmount} />
                              </td>
                              <td style={{ padding: '0.75rem 1rem 0.75rem 0', color: pct > 100 ? '#b91c1c' : '#0f172a' }}>
                                <Money value={spent} />
                              </td>
                              <td style={{ padding: '0.75rem 1rem 0.75rem 0' }}>
                                <Money value={category.allocatedAmount - spent} />
                              </td>
                              <td style={{ padding: '0.75rem 0', minWidth: '140px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <ProgressBar
                                    value={spent}
                                    total={category.allocatedAmount}
                                    color={pct > 100 ? '#ef4444' : '#22a039'}
                                    height={6}
                                  />
                                  <span style={{ fontSize: '0.78rem', color: '#64748b', minWidth: '48px' }}>
                                    {pct.toFixed(0)}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </DataTable>
                    </div>
                  </details>
                )}
              </Panel>
            );
          })}

          <Panel
            title="Submissões recentes"
            description="Últimos relatórios enviados à Agência."
            padded={false}
          >
            <div style={{ padding: '1.75rem' }}>
              {recentReports.length === 0 ? (
                <EmptyState
                  title="Ainda não submeteu relatórios"
                  description="Comece por preencher o relatório trimestral com a actividade realizada, o progresso físico e as despesas do trimestre."
                  action={
                    <Link href="/pme/relatorios/novo" className="btn btn-primary">
                      Submeter primeiro relatório
                    </Link>
                  }
                />
              ) : (
                <DataTable
                  head={['Projecto', 'Período', 'Estado', 'Submetido em', 'Despesas', '']}
                >
                  {recentReports.map((report) => (
                    <tr key={report.id}>
                      <td style={{ padding: '0.85rem 1rem 0.85rem 0', fontWeight: 600, color: '#0f172a' }}>
                        {report.subprojectName}
                      </td>
                      <td style={{ padding: '0.85rem 1rem 0.85rem 0' }}>{report.period}</td>
                      <td style={{ padding: '0.85rem 1rem 0.85rem 0' }}>
                        <StatusBadge status={report.status} />
                      </td>
                      <td style={{ padding: '0.85rem 1rem 0.85rem 0', color: '#64748b' }}>
                        {formatDate(report.submissionDate)}
                      </td>
                      <td style={{ padding: '0.85rem 1rem 0.85rem 0' }}>
                        <Money value={report.fundsUsed} /> MZN
                      </td>
                      <td style={{ padding: '0.85rem 0' }}>
                        <Link
                          href={`/pme/relatorios/${report.id}`}
                          style={{ color: '#166534', fontWeight: 700, fontSize: '0.85rem' }}
                        >
                          Ver →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </DataTable>
              )}
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}