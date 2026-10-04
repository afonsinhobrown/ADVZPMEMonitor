import React from 'react';

export default function Estatisticas() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2 className="text-xl font-bold mb-4">Estatísticas e Dashboards</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '2rem', textAlign: 'center', borderLeft: '4px solid var(--success)' }}>
          <h3 className="text-sm text-secondary">Projectos em Dia</h3>
          <p className="text-2xl font-bold" style={{ color: 'var(--success)' }}>24</p>
        </div>
        <div className="card" style={{ padding: '2rem', textAlign: 'center', borderLeft: '4px solid var(--warning)' }}>
          <h3 className="text-sm text-secondary">Projectos Atrasados</h3>
          <p className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>5</p>
        </div>
        <div className="card" style={{ padding: '2rem', textAlign: 'center', borderLeft: '4px solid var(--accent-primary)' }}>
          <h3 className="text-sm text-secondary">Nível de Aceitação</h3>
          <p className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>85%</p>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <h3 className="text-lg font-semibold mb-4">Status dos Projectos</h3>
        <p className="text-secondary">Aqui será renderizado um gráfico detalhado da execução financeira vs execução física dos subprojectos, integrando dados do sistema (Recharts ou Chart.js).</p>
        
        {/* Espaço reservado para o Gráfico */}
        <div style={{ height: '300px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem', border: '1px dashed var(--border)' }}>
          <span className="text-secondary">Gráfico de Progresso</span>
        </div>
      </div>
    </div>
  );
}
