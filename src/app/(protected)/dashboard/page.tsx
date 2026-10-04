import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function Dashboard() {
  const [total, orcamentoAgg, pendentes, visitas, recentes] = await Promise.all([
    prisma.subproject.count(),
    prisma.subproject.aggregate({ _sum: { totalBudget: true } }),
    prisma.quarterlyReport.count({ where: { status: { in: ['SUBMITTED', 'IN_REVIEW'] } } }),
    prisma.fieldVisit.count({ where: { status: 'PLANNED' } }),
    prisma.subproject.findMany({
      include: { pme: true, reports: { orderBy: { createdAt: 'desc' }, take: 1 } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  const executado = await prisma.expense.aggregate({ _sum: { amount: true } });
  const totalOrcamento = orcamentoAgg._sum.totalBudget ?? 0;
  const totalExecutado = executado._sum.amount ?? 0;
  const percentagem = totalOrcamento > 0 ? Math.round((totalExecutado / totalOrcamento) * 100) : 0;

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-secondary">Total de Subprojectos</p>
          <h3 className="text-xl font-bold" style={{ marginTop: '0.5rem' }}>{total}</h3>
        </div>
        <div className="card">
          <p className="text-sm text-secondary">Orçamento Global Executado</p>
          <h3 className="text-xl font-bold" style={{ marginTop: '0.5rem', color: 'var(--success)' }}>{percentagem}%</h3>
        </div>
        <div className="card">
          <p className="text-sm text-secondary">Relatórios Pendentes</p>
          <h3 className="text-xl font-bold" style={{ marginTop: '0.5rem', color: 'var(--warning)' }}>{pendentes}</h3>
        </div>
        <div className="card">
          <p className="text-sm text-secondary">Visitas Agendadas</p>
          <h3 className="text-xl font-bold" style={{ marginTop: '0.5rem' }}>{visitas}</h3>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className="text-lg font-semibold">Subprojectos Recentes</h3>
          <div className="flex gap-2">
            <a className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} href="/api/export?resource=subprojectos">Exportar Excel (CSV)</a>
            <a className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} href="/imprimir" target="_blank">Exportar PDF</a>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '1rem 0' }}>Nome</th>
              <th>Beneficiário</th>
              <th>Data de Início</th>
              <th>Estado do Reporte</th>
            </tr>
          </thead>
          <tbody>
            {recentes.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem 0', fontWeight: '500' }}>{s.name}</td>
                <td className="text-secondary">{s.pme?.name ?? '-'}</td>
                <td className="text-secondary">{s.startDate.toLocaleDateString('pt-MZ')}</td>
                <td><span className="badge">{s.reports[0]?.status ?? 'SEM REPORTE'}</span></td>
              </tr>
            ))}
            {recentes.length === 0 && (
              <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Sem subprojectos.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
