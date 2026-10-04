import React from 'react';

export default function PortalPME() {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '2rem' }}>
        <h2 className="text-xl font-bold">Portal da PME</h2>
        <span className="badge badge-success">PME: Agro Lda</span>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginTop: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 className="text-lg font-semibold mb-4">Actividades em Curso</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 'bold' }}>Aquisição de Sementes</div>
              <div className="text-sm text-secondary">Prazo: 15 Abr 2026</div>
              <span className="badge badge-warning" style={{ marginTop: '0.5rem' }}>Em Andamento</span>
            </li>
            <li style={{ padding: '1rem' }}>
              <div style={{ fontWeight: 'bold' }}>Preparação do Terreno</div>
              <div className="text-sm text-secondary">Prazo: 05 Mai 2026</div>
              <span className="badge" style={{ marginTop: '0.5rem' }}>Pendente</span>
            </li>
          </ul>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 className="text-lg font-semibold mb-4">Submeter Relatório de Actividade</h3>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Actividade Relacionada</label>
              <select className="form-input" style={{ width: '100%' }}>
                <option>Aquisição de Sementes</option>
                <option>Preparação do Terreno</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Descrição do Progresso</label>
              <textarea className="form-input" rows={4} style={{ width: '100%' }} placeholder="Descreva o que foi feito..." />
            </div>

            <div>
              <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Evidências (Imagens/Comprovativos)</label>
              <input type="file" multiple className="form-input" style={{ width: '100%' }} />
              <p className="text-xs text-secondary mt-1">Formatos suportados: JPG, PNG, PDF</p>
            </div>

            <button type="button" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>Enviar Relatório</button>
          </form>
        </div>
      </div>
    </div>
  );
}
