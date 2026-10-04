'use client';

import React, { useState } from 'react';
import { createTechnicalReport } from '@/app/actions';

export default function RelatoriosClient({ reports, projects }: { reports: any[], projects: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await createTechnicalReport(formData);
    
    setIsLoading(false);
    
    if (result.success) {
      alert("Relatório submetido com sucesso!");
      setIsModalOpen(false);
      window.location.reload();
    } else {
      alert("Erro ao submeter relatório: " + result.error);
    }
  };

  const openViewModal = (report: any) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };

  const filtered = reports.filter(r => 
    r.subproject?.name.toLowerCase().includes(search.toLowerCase()) || 
    r.period.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Relatórios Trimestrais do Técnico</h2>
      
      <div className="card">
        <p className="text-secondary mb-4">Acompanhamento de relatórios trimestrais submetidos pelos técnicos para cada projecto/subprojecto.</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <select 
            className="form-input" 
            style={{ width: '300px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          >
            <option value="">Todos os Projectos</option>
            {projects.map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Novo Relatório</button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th>Projecto</th>
              <th>Período</th>
              <th>Data Submissão</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(report => (
              <tr key={report.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem 0' }}>{report.subproject?.name}</td>
                <td>{report.period}</td>
                <td className="text-secondary">
                  {report.submissionDate ? new Date(report.submissionDate).toLocaleDateString('pt-MZ') : '-'}
                </td>
                <td>
                  <span className={`badge ${report.status === 'APPROVED' ? 'badge-success' : report.status === 'SUBMITTED' ? 'badge-warning' : ''}`} style={{ background: report.status === 'SUBMITTED' ? '#fef3c7' : '' }}>
                    {report.status}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => openViewModal(report)}>👁️ Ver Detalhes</button>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>✏️ Editar</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  Nenhum relatório encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal - Novo Relatório */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '2.5rem', background: 'white', borderRadius: 'var(--radius-lg)', animation: 'fadeIn 0.2s ease-in-out' }}>
            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Criar Relatório Técnico</h3>
            
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Projecto / Subprojecto</label>
                <select name="subprojectId" className="form-input" style={{ width: '100%' }} required>
                  <option value="">Seleccione o projecto...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Período (Ex: Q1 2026)</label>
                <input type="text" name="period" className="form-input" style={{ width: '100%' }} placeholder="Q1 2026" required />
              </div>

              <div>
                <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Parecer Técnico / Conteúdo</label>
                <textarea name="content" className="form-input" style={{ width: '100%', minHeight: '150px', resize: 'vertical' }} placeholder="Descreva os achados, progresso físico e observações..." required></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? 'A Submeter...' : 'Submeter Relatório'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Visualizar */}
      {isViewModalOpen && selectedReport && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '700px', padding: '2.5rem', background: 'white', borderRadius: 'var(--radius-lg)', animation: 'fadeIn 0.2s ease-in-out', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <div>
                <h3 className="text-2xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>Relatório Técnico: {selectedReport.period}</h3>
                <p className="text-secondary">{selectedReport.subproject?.name}</p>
              </div>
              <span className={`badge ${selectedReport.status === 'APPROVED' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.9rem' }}>
                {selectedReport.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '1.5rem' }}>
              <div>
                <p className="text-sm text-secondary font-semibold">Autor (Técnico)</p>
                <p className="text-lg font-medium">{selectedReport.technician?.name || 'Afonso Pene'}</p>
              </div>
              <div>
                <p className="text-sm text-secondary font-semibold">Data de Submissão</p>
                <p className="text-lg font-medium">{selectedReport.submissionDate ? new Date(selectedReport.submissionDate).toLocaleDateString('pt-MZ') : 'N/A'}</p>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
              <h4 className="font-bold mb-2">Parecer Técnico</h4>
              <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>
                {selectedReport.content}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsViewModalOpen(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
