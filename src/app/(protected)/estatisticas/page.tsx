import React from 'react';
import { PrismaClient } from '@prisma/client';
import EstatisticasChart from './EstatisticasChart';

const prisma = new PrismaClient();

export default async function Estatisticas() {
  const subprojectos = await prisma.subproject.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { reports: { select: { fundsUsed: true, status: true } } }
  });

  const emCurso = subprojectos.filter(s => s.status === 'EM_CURSO').length;
  const atrasados = subprojectos.filter(s => s.status === 'ATRASADO').length;

  const countedStatuses = ['SUBMITTED', 'IN_REVIEW', 'APPROVED'];

  const chartData = subprojectos.map((sub) => ({
    name: sub.name,
    totalBudget: sub.totalBudget,
    executed: sub.reports
      .filter((report) => countedStatuses.includes(report.status))
      .reduce((total, report) => total + (report.fundsUsed ?? 0), 0),
  }));

  return (
    <div style={{ padding: '2rem' }}>
      <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Estatísticas e Dashboards</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '2rem', textAlign: 'center', borderLeft: '4px solid var(--success)' }}>
          <h3 className="text-sm text-secondary font-semibold">Projectos em Curso</h3>
          <p className="text-3xl font-bold" style={{ color: 'var(--success)', marginTop: '0.5rem' }}>{emCurso}</p>
        </div>
        <div className="card" style={{ padding: '2rem', textAlign: 'center', borderLeft: '4px solid var(--warning)' }}>
          <h3 className="text-sm text-secondary font-semibold">Projectos Atrasados</h3>
          <p className="text-3xl font-bold" style={{ color: 'var(--warning)', marginTop: '0.5rem' }}>{atrasados}</p>
        </div>
        <div className="card" style={{ padding: '2rem', textAlign: 'center', borderLeft: '4px solid var(--accent-primary)' }}>
          <h3 className="text-sm text-secondary font-semibold">Total Registado (Amostra)</h3>
          <p className="text-3xl font-bold" style={{ color: 'var(--accent-primary)', marginTop: '0.5rem' }}>{subprojectos.length}</p>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <h3 className="text-lg font-bold mb-2">Status dos Projectos vs Execução Financeira</h3>
        <p className="text-secondary mb-4">Alocação do orçamento aprovado face à execução financeira já submetida pelos beneficiários.</p>
        
        {subprojectos.length > 0 ? (
          <EstatisticasChart data={chartData} />
        ) : (
          <div style={{ height: '300px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem', border: '1px dashed var(--border)' }}>
            <span className="text-secondary">Não há dados suficientes para gerar o gráfico.</span>
          </div>
        )}
      </div>
    </div>
  );
}
