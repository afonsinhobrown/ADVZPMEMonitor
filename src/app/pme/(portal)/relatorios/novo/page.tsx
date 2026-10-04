import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getPmeUser } from '@/lib/auth';
import { canEditReport, formatDate, toDateInputValue } from '@/lib/format';
import { currentQuarter, parsePeriod, periodKey, quarterDeadline, quarterOptions } from '@/lib/quarter';
import { MAX_EVIDENCE_FILES } from '@/lib/evidence';
import { Notice, Panel } from '@/app/pme/components';
import RelatorioForm from './RelatorioForm';

export default async function NewReportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getPmeUser();
  if (!user?.pme) redirect('/pme/login');

  const query = await searchParams;

  const subprojects = await prisma.subproject.findMany({
    where: { pmeId: user.pme.id },
    orderBy: { startDate: 'asc' },
    include: { budgetCategories: { orderBy: { name: 'asc' } } },
  });

  if (subprojects.length === 0) {
    return (
      <div>
        <h1 style={{ margin: '0 0 1.5rem 0', fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
          Submeter relatório trimestral
        </h1>
        <Panel>
          <Notice tone="info" title="Sem projecto atribuído">
            A sua empresa ainda não tem projectos financiados registados pela Agência. Assim que existir um
            projecto associado, poderá submeter aqui os relatórios trimestrais.
          </Notice>
          <Link href="/pme" className="btn btn-secondary">
            Voltar ao painel
          </Link>
        </Panel>
      </div>
    );
  }

  const reportId = typeof query.id === 'string' ? query.id : null;
  const presetSubprojectId = typeof query.subprojectId === 'string' ? query.subprojectId : null;
  const presetPeriod = typeof query.period === 'string' ? query.period : null;

  const existing = reportId
    ? await prisma.quarterlyReport.findFirst({
        where: { id: reportId, subproject: { pmeId: user.pme.id } },
        include: {
          expenses: { orderBy: { date: 'asc' } },
          attachments: { select: { id: true } },
        },
      })
    : null;

  if (reportId && !existing) notFound();

  const today = currentQuarter();
  const defaultPeriod = periodKey(today.quarter, today.year);

  const initialSubprojectId = existing?.subprojectId ?? presetSubprojectId ?? subprojects[0].id;
  const selectedSubproject =
    subprojects.find((item) => item.id === initialSubprojectId) ?? subprojects[0];

  const initialPeriod = existing?.period ?? presetPeriod ?? defaultPeriod;

  const committedByCategory = await prisma.expense.groupBy({
    by: ['categoryId'],
    where: {
      category: { subprojectId: selectedSubproject.id },
      report: { status: { in: ['SUBMITTED', 'IN_REVIEW', 'APPROVED'] } },
      ...(existing ? { reportId: { not: existing.id } } : {}),
    },
    _sum: { amount: true },
  });

  const committedMap = new Map(
    committedByCategory.map((row) => [row.categoryId, row._sum.amount ?? 0])
  );

  const parsedPeriod = parsePeriod(initialPeriod);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/pme/relatorios" style={{ color: '#166534', fontWeight: 700, fontSize: '0.88rem' }}>
          ← Voltar aos relatórios
        </Link>
      </div>

      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
          {existing ? 'Continuar relatório trimestral' : 'Submeter relatório trimestral'}
        </h1>
        <p style={{ margin: '0.35rem 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>
          Preencha os dados do trimestre, declare as despesas realizadas e anexe as evidências. As despesas
          são validadas contra o orçamento aprovado do projecto.
        </p>
      </div>

      {existing && !canEditReport(existing.status) && (
        <Notice tone="warning" title="Relatório já submetido">
          Este relatório está em análise pela Agência e já não pode ser alterado.{' '}
          <Link
            href={`/pme/relatorios/${existing.id}`}
            style={{ fontWeight: 700, textDecoration: 'underline' }}
          >
            Ver detalhe do relatório
          </Link>
          .
        </Notice>
      )}

      {existing && existing.status === 'RETURNED' && existing.reviewNotes && (
        <Notice tone="danger" title="A Agência devolveu este relatório">
          {existing.reviewNotes}
        </Notice>
      )}

      {existing && canEditReport(existing.status) && existing.attachments.length > 0 && (
        <Notice
          tone="info"
          title={`${existing.attachments.length} evidência(s) já anexada(s) a este relatório`}
        >
          As evidências já enviadas serão mantidas. Pode anexar até{' '}
          {Math.max(0, MAX_EVIDENCE_FILES - existing.attachments.length)} ficheiro(s) adicionais.
        </Notice>
      )}

      <RelatorioForm
        reportId={existing?.id ?? null}
        locked={Boolean(existing && !canEditReport(existing.status))}
        lockedPeriod={Boolean(existing && !canEditReport(existing.status))}
        subprojects={subprojects.map((subproject) => ({
          id: subproject.id,
          name: subproject.name,
          agreementNumber: subproject.agreementNumber,
          categories: subproject.budgetCategories.map((category) => ({
            id: category.id,
            name: category.name,
            allocatedAmount: category.allocatedAmount,
            alreadyCommitted: committedMap.get(category.id) ?? 0,
          })),
        }))}
        defaultSubprojectId={selectedSubproject.id}
        defaultPeriod={initialPeriod}
        periodOptions={quarterOptions().map((option) => ({
          value: option.value,
          label: option.label,
          deadline: formatDate(option.deadline),
        }))}
        deadlineLabel={
          parsedPeriod ? formatDate(quarterDeadline(parsedPeriod.quarter, parsedPeriod.year)) : ''
        }
        initialValues={{
          mainActivity: existing?.mainActivity ?? '',
          progressDescription: existing?.progressDescription ?? '',
          challenges: existing?.challenges ?? '',
          safeguardsNotes: existing?.safeguardsNotes ?? '',
        }}
        initialExpenses={
          existing?.expenses.map((expense) => ({
            key: expense.id,
            description: expense.description,
            amount: String(expense.amount),
            date: toDateInputValue(expense.date),
            categoryId: expense.categoryId,
          })) ?? [{ key: 'linha-inicial', description: '', amount: '', date: '', categoryId: '' }]
        }
      />
    </div>
  );
}