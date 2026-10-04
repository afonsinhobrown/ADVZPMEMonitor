import React from 'react';

export default function RelatoriosTecnicos() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2 className="text-xl font-bold mb-4">Relatórios Trimestrais do Técnico</h2>
      
      <div className="card" style={{ padding: '2rem' }}>
        <p className="text-secondary mb-4">Acompanhamento de relatórios trimestrais submetidos pelos técnicos para cada projecto/subprojecto.</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <select className="form-input" style={{ width: '250px' }}>
            <option value="">Todos os Projectos</option>
            <option value="1">Subprojecto Agrícola Malanje</option>
            <option value="2">Sistema de Irrigação Benguela</option>
          </select>
          <button className="btn btn-primary">+ Novo Relatório</button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>Projecto</th>
              <th style={{ padding: '1rem' }}>Período</th>
              <th style={{ padding: '1rem' }}>Data Submissão</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '1rem' }}>Subprojecto Agrícola Malanje</td>
              <td style={{ padding: '1rem' }}>Q1 2026</td>
              <td style={{ padding: '1rem' }}>10 Mar 2026</td>
              <td style={{ padding: '1rem' }}><span className="badge badge-success">APROVADO</span></td>
              <td style={{ padding: '1rem' }}>
                <button className="btn btn-secondary">Ver Detalhes</button>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '1rem' }}>Sistema de Irrigação Benguela</td>
              <td style={{ padding: '1rem' }}>Q1 2026</td>
              <td style={{ padding: '1rem' }}>-</td>
              <td style={{ padding: '1rem' }}><span className="badge badge-warning">RASCUNHO</span></td>
              <td style={{ padding: '1rem' }}>
                <button className="btn btn-secondary">Editar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
