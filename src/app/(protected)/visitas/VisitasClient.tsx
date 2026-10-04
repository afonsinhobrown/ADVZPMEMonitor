'use client';

import React, { useState } from 'react';
import { createFieldVisit } from '@/app/actions';

export default function VisitasClient({ visits, projects }: { visits: any[], projects: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await createFieldVisit(formData);
    
    setIsLoading(false);
    
    if (result.success) {
      alert("Visita agendada com sucesso!");
      setIsModalOpen(false);
      window.location.reload();
    } else {
      alert("Erro ao agendar visita: " + result.error);
    }
  };

  const openViewModal = (visit: any) => {
    setSelectedVisit(visit);
    setIsViewModalOpen(true);
  };

  const filtered = visits.filter(v => 
    v.subproject?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Visitas de Campo</h2>
      
      <div className="card">
        <p className="text-secondary mb-4">Agendamento e acompanhamento de monitoria local nos locais de execução.</p>
        
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
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Agendar Visita</button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th>Projecto</th>
              <th>Data Agendada</th>
              <th>Inspector</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(visit => (
              <tr key={visit.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem 0' }}>{visit.subproject?.name}</td>
                <td>{new Date(visit.scheduledDate).toLocaleDateString('pt-MZ')}</td>
                <td className="text-secondary">{visit.inspector?.name || 'Afonso Pene'}</td>
                <td>
                  <span className={`badge ${visit.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`} style={{ background: visit.status === 'PLANNED' ? '#fef3c7' : '' }}>
                    {visit.status === 'PLANNED' ? 'PLANEADA' : 'CONCLUÍDA'}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => openViewModal(visit)}>👁️ Detalhes</button>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>✏️ Atualizar</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  Nenhuma visita agendada encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal - Nova Visita */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '2.5rem', background: 'white', borderRadius: 'var(--radius-lg)', animation: 'fadeIn 0.2s ease-in-out' }}>
            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Agendar Visita de Campo</h3>
            
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
                <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Data Prevista</label>
                <input type="date" name="scheduledDate" className="form-input" style={{ width: '100%' }} required />
              </div>

              <div>
                <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Objectivo da Visita / Notas Pré-Visita</label>
                <textarea name="findings" className="form-input" style={{ width: '100%', minHeight: '100px', resize: 'vertical' }} placeholder="Descreva os focos desta deslocação..."></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? 'A Agendar...' : 'Agendar Visita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Visualizar */}
      {isViewModalOpen && selectedVisit && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '700px', padding: '2.5rem', background: 'white', borderRadius: 'var(--radius-lg)', animation: 'fadeIn 0.2s ease-in-out', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <div>
                <h3 className="text-2xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>Relatório de Deslocação</h3>
                <p className="text-secondary">{selectedVisit.subproject?.name}</p>
              </div>
              <span className={`badge ${selectedVisit.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.9rem' }}>
                {selectedVisit.status === 'COMPLETED' ? 'CONCLUÍDA' : 'PLANEADA'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '1.5rem' }}>
              <div>
                <p className="text-sm text-secondary font-semibold">Técnico Encarregado</p>
                <p className="text-lg font-medium">{selectedVisit.inspector?.name || 'Afonso Pene'}</p>
              </div>
              <div>
                <p className="text-sm text-secondary font-semibold">Data Agendada</p>
                <p className="text-lg font-medium">{new Date(selectedVisit.scheduledDate).toLocaleDateString('pt-MZ')}</p>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
              <h4 className="font-bold mb-2">Constatações / Parecer Local</h4>
              <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>
                {selectedVisit.findings || 'Ainda não foram registados os achados da visita.'}
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
