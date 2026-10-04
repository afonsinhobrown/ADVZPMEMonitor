import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ReportStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getPmeUser } from '@/lib/auth';
import { periodOrder } from '@/lib/quarter';
import { REPORT_STATUS, formatDate, canEditReport } from '@/lib/format';
import { DataTable, EmptyState, Money, Notice, Panel, StatusBadge } from '@/app/pme/components';

const FILTERS: { value: string; label: string }[] = [
  { value: 'TODOS', label: 'Todos' },
  { value: 'DRAFT', label: 'Rascunhos' },
  { value: 'RETURNED', label: 'Devolvidos' },
  { value: 'SUBMITTED', label: 'Submetidos' },
  { value: 'IN_REVIEW', label: 'Em Revisão' },
  { value: 'APPROVED', label: 'Aprovados' },
];

const NOTICES: Record<string, { tone: 'success' | 'warning' | 'danger' | 'info'; title: string }> = {
  submetido: {
    tone: 'success',
    title: 'Relatório submetido com sucesso. O relatório entrou na fila de validação da Agência.',
  },
  rascunho: { tone: 'info', title: 'Rascunho guardado. Pode continuar a editá-lo até o submeter.' },
  eliminado: { tone: 'info', title: 'Relatório eliminado.' },
  bloqueado: {
    tone: 'danger',
    title: 'Este relatório já foi submetido e está em análise. Não pode ser eliminado.',
  },
};

export default async function PmeReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getPmeUser();
  if (!user?.pme) redirect('/pme/login');

  const params = await searchParams;
  const activeFilter = typeof params.filtro === 'string' ? params.filtro : 'TODOS';
  const avisoKey = typeof params.aviso === 'string' ? params.aviso : null;

  const reports = await prisma.quarterlyReport.findMany({
    where: {
      subproject: { pmeId: user.pme.id },
      ...(activeFilter !== 'TODOS' ? { status: activeFilter as ReportStatus } : {}),
    },
    orderBy: [{ period: 'desc' }, { updatedAt: 'desc' }],
    include: {
      subproject: { select: { name: true, agreementNumber: true } },
      expenses: true,
      attachments: { select: { id: true } },
    },
  });

  const ordered = [...reports].sort((a, b) => {
    const byPeriod = periodOrder(b.period) - periodOrder(a.period);
    if (byPeriod !== 0) return byPeriod;
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });

  const notice = avisoKey ? NOTICES[avisoKey] : null;

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
            Relatórios Trimestrais
          </h1>
          <p style={{ margin: '0.35rem 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>
            Histórico de todas as submissões à Agência, com o estado de validação de cada relatório.
          </p>
        </div>
        <Link href="/pme/relatorios/novo" className="btn btn-primary" id="pme-new-report">
          Novo relatório
        </Link>
      </div>

      {notice && <Notice tone={notice.tone} title={notice.title} />}

      <Panel padded={false}>
        <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {FILTERS.map((filter) => {
            const active = filter.value === activeFilter;
            return (
              <Link
                key={filter.value}
                href={filter.value === 'TODOS' ? '/pme/relatorios' : `/pme/relatorios?filtro=${filter.value}`}
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  background: active ? '#22a039' : '#f1f5f9',
                  color: active ? '#ffffff' : '#64748b',
                  transition: 'all 0.2s',
                }}
              >
                {filter.label}
              </Link>
            );
          })}
        </div>

        <div style={{ padding: '1.75rem' }}>
          {ordered.length === 0 ? (
            <EmptyState
              title="Sem relatórios nesta categoria"
              description="Ainda não existem relatórios com este estado. Submeta o relatório do trimestre para começar o acompanhamento."
              action={
                <Link href="/pme/relatorios/novo" className="btn btn-primary">
                  Submeter relatório
                </Link>
              }
            />
          ) : (
            <DataTable
              head={['Projecto', 'Período', 'Estado', 'Fundos utilizados', 'Evidências', 'Acções']}
            >
              {ordered.map((report) => (
                <tr key={report.id}>
                  <td style={{ padding: '0.85rem 1rem 0.85rem 0' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{report.subproject.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      {report.subproject.agreementNumber}
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem 0.85rem 0', whiteSpace: 'nowrap' }}>
                    {report.period}
                  </td>
                  <td style={{ padding: '0.85rem 1rem 0.85rem 0' }}>
                    <StatusBadge status={report.status} />
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                      {formatDate(report.submissionDate ?? report.updatedAt)}
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem 0.85rem 0', whiteSpace: 'nowrap' }}>
                    <Money value={report.fundsUsed} /> MZN
                  </td>
                  <td style={{ padding: '0.85rem 1rem 0.85rem 0', color: '#64748b' }}>
                    {report.attachments.length} ficheiro(s)
                  </td>
                  <td style={{ padding: '0.85rem 0', whiteSpace: 'nowrap' }}>
                    <Link
                      href={`/pme/relatorios/${report.id}`}
                      style={{ color: '#166534', fontWeight: 700, fontSize: '0.85rem', marginRight: '0.75rem' }}
                    >
                      Ver
                    </Link>
                    {canEditReport(report.status) && (
                      <Link
                        href={`/pme/relatorios/novo?id=${report.id}`}
                        style={{ color: '#1d4ed8', fontWeight: 700, fontSize: '0.85rem' }}
                      >
                        Continuar
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </DataTable>
          )}
        </div>
      </Panel>

      <Panel title="Como funciona o fluxo">
        <ol style={{ margin: 0, paddingLeft: '1.25rem', color: '#475569', lineHeight: 2, fontSize: '0.92rem' }}>
          <li>
            Preencha o relatório e <strong>guarde como rascunho</strong> enquanto revê os dados — o rascunho
            só é visível para si.
          </li>
          <li>
            Quando tudo estiver correcto, <strong>submeta</strong>. O relatório passa a {REPORT_STATUS.SUBMITTED.label.toLowerCase()}
            e a Agência inicia a validação técnica.
          </li>
          <li>
            Se a Agência encontrar falhas, o relatório é <strong>devolvido</strong> e pode ser corrigido e
            submetido novamente.
          </li>
          <li>
            Só depois de <strong>aprovado</strong> é que a despesa correspondente é considerada validada para
            efeitos de desembolso.
          </li>
        </ol>
      </Panel>
    </div>
  );
}