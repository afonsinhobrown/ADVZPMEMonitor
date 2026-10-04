'use client';

import React, { useState } from 'react';

export default function ComparacaoClient({ 
  projects, 
  pmeReports, 
  techReports 
}: { 
  projects: any[], 
  pmeReports: any[], 
  techReports: any[] 
}) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Q1 2026');

  // Find reports for the selected project and period
  const pmeReport = pmeReports.find(r => r.subprojectId === selectedProjectId && r.period === selectedPeriod);
  const techReport = techReports.find(r => r.subprojectId === selectedProjectId && r.period === selectedPeriod);

  return (
    <div style={{ padding: '2rem' }}>
      <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Avaliação e Comparação de Relatórios (Admin)</h2>
      <p className="text-secondary mb-6">Compare o relatório submetido pela PME com o relatório de avaliação preenchido pelo Técnico da Agência.</p>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <select 
          className="form-input" 
          style={{ width: '300px' }}
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
        >
          <option value="">Seleccione o Projecto...</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name} ({p.pme?.name || 'Sem PME'})</option>
          ))}
        </select>
        <select 
          className="form-input" 
          style={{ width: '200px' }}
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          <option value="Q1 2026">Q1 2026</option>
          <option value="Q2 2026">Q2 2026</option>
          <option value="Q3 2026">Q3 2026</option>
          <option value="Q4 2026">Q4 2026</option>
        </select>
      </div>

      {!selectedProjectId ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p className="text-secondary">Por favor, seleccione um projecto para iniciar a comparação cruzada de relatórios.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {/* Coluna 1: Relatório da PME */}
          <div className="card" style={{ borderTop: '4px solid #22a039', padding: '1.5rem', opacity: pmeReport ? 1 : 0.6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="text-lg font-bold">Relatório da PME</h3>
              {pmeReport ? (
                <span className="badge badge-success">Submetido</span>
              ) : (
                <span className="badge badge-warning" style={{ background: '#fef3c7' }}>Pendente</span>
              )}
            </div>

            {pmeReport ? (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 className="text-sm text-secondary font-semibold">Avaliação Qualitativa (Progresso e Desafios)</h4>
                  <p className="mt-1" style={{ whiteSpace: 'pre-wrap' }}>{pmeReport.reviewNotes || 'Nenhuma nota declarada.'}</p>
                </div>
              </>
            ) : (
              <p className="text-secondary text-sm">A PME ainda não submeteu o relatório financeiro/narrativo para este período.</p>
            )}
          </div>

          {/* Coluna 2: Relatório do Técnico */}
          <div className="card" style={{ borderTop: '4px solid #0076d6', padding: '1.5rem', background: '#fafafa', opacity: techReport ? 1 : 0.6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="text-lg font-bold" style={{ color: '#0076d6' }}>Relatório do Técnico (Agência)</h3>
              {techReport ? (
                <span className="badge badge-success">Avaliado</span>
              ) : (
                <span className="badge badge-warning" style={{ background: '#fef3c7' }}>Pendente</span>
              )}
            </div>

            {techReport ? (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 className="text-sm text-secondary font-semibold">Parecer e Validação Técnica</h4>
                  <p className="mt-1" style={{ whiteSpace: 'pre-wrap' }}>{techReport.content}</p>
                </div>

                <div>
                  <h4 className="text-sm text-secondary font-semibold mb-2">Conclusão do Técnico</h4>
                  <span className="badge badge-success" style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>Relatório Consistente / Aprovado</span>
                </div>
              </>
            ) : (
              <p className="text-secondary text-sm">O Técnico da Agência ainda não efetuou a monitoria e submissão do parecer para este período.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
