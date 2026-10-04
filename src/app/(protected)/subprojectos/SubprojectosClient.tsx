'use client';

import React, { useState } from 'react';
import type { PME, Subproject } from '@prisma/client';
import { createSubproject, reviewActivityPlan } from '@/app/actions';

type SubprojectRow = Subproject & { pme: PME | null };

export default function SubprojectosClient({
  subprojectos,
  pmes
}: {
  subprojectos: SubprojectRow[],
  pmes: PME[]
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<SubprojectRow | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [planNotes, setPlanNotes] = useState('');

  const handlePlanReview = async (status: 'APPROVED' | 'RETURNED') => {
    if (!selectedProject) return;
    setIsLoading(true);
    const result = await reviewActivityPlan(selectedProject.id, status, planNotes);
    setIsLoading(false);
    if (result.success) {
      alert(status === 'APPROVED' ? 'Plano aprovado.' : 'Plano devolvido à PME.');
      setIsViewModalOpen(false);
      setPlanNotes('');
      window.location.reload();
    } else {
      alert('Erro: ' + result.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await createSubproject(formData);
    
    setIsLoading(false);
    
    if (result.success) {
      alert("Subprojecto criado com sucesso!");
      setIsModalOpen(false);
      window.location.reload();
    } else {
      alert("Erro ao criar Subprojecto: " + result.error);
    }
  };

  const openViewModal = (project: SubprojectRow) => {
    setSelectedProject(project);
    setIsViewModalOpen(true);
  };

  const filtered = subprojectos.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    (s.pme?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
        <h2 className="text-xl font-bold">Subprojectos</h2>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Novo Subprojecto</button>
      </div>

      <div className="card">
        <div className="flex gap-4" style={{ marginBottom: '1.5rem' }}>
          <input 
            type="text" 
            className="input" 
            placeholder="Pesquisar por nome ou beneficiário..." 
            style={{ maxWidth: '400px' }} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="input" style={{ maxWidth: '200px' }}>
            <option>Todos os Sectores</option>
            <option>Agricultura</option>
            <option>Pecuária</option>
          </select>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '1rem 0' }}>Acordo Nº</th>
              <th>Nome</th>
              <th>Beneficiário</th>
              <th>Orçamento (MZN)</th>
              <th>Status</th>
              <th>Responsável</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(sub => (
              <tr key={sub.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem 0', fontWeight: '500' }}>{sub.agreementNumber}</td>
                <td>{sub.name}</td>
                <td className="text-secondary">{sub.pme?.name || 'Desconhecido'}</td>
                <td className="font-semibold">{new Intl.NumberFormat('pt-MZ').format(sub.totalBudget)}</td>
                <td>
                  <span className={`badge ${sub.status === 'EM_CURSO' ? 'badge-success' : 'badge-warning'}`}>
                    {sub.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="text-secondary">Afonso Pene</td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => openViewModal(sub)}>👁️ Ver</button>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>✏️ Editar</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  Nenhum subprojecto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal - Cadastro */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '2.5rem', background: 'white', borderRadius: 'var(--radius-lg)', animation: 'fadeIn 0.2s ease-in-out' }}>
            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Cadastrar Novo Subprojecto</h3>
            
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Nome do Projecto</label>
                <input type="text" name="name" className="form-input" style={{ width: '100%' }} placeholder="Insira o nome do projecto" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Nº de Acordo</label>
                  <input type="text" name="agreementNumber" className="form-input" style={{ width: '100%' }} placeholder="Ex: AS-004/2026" required />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>PME / Beneficiário</label>
                  <select name="pmeId" className="form-input" style={{ width: '100%' }} required>
                    <option value="">Seleccione a PME...</option>
                    {pmes.map(pme => (
                      <option key={pme.id} value={pme.id}>{pme.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Orçamento Total (MZN)</label>
                  <input type="number" name="totalBudget" className="form-input" style={{ width: '100%' }} placeholder="0.00" required />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Localização</label>
                  <input type="text" name="location" className="form-input" style={{ width: '100%' }} placeholder="Província/Distrito" required />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Data de Início</label>
                  <input type="date" name="startDate" className="form-input" style={{ width: '100%' }} required />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Data de Término</label>
                  <input type="date" name="endDate" className="form-input" style={{ width: '100%' }} required />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? 'A Guardar...' : 'Guardar Subprojecto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Visualizar */}
      {isViewModalOpen && selectedProject && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '800px', padding: '2.5rem', background: 'white', borderRadius: 'var(--radius-lg)', animation: 'fadeIn 0.2s ease-in-out', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <div>
                <h3 className="text-2xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>Detalhes do Processo</h3>
                <p className="text-secondary">{selectedProject.agreementNumber}</p>
              </div>
              <span className={`badge ${selectedProject.status === 'EM_CURSO' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '1rem' }}>
                {selectedProject.status.replace('_', ' ')}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '2rem' }}>
              <div>
                <p className="text-sm text-secondary font-semibold">Nome do Projecto</p>
                <p className="text-lg font-medium">{selectedProject.name}</p>
              </div>
              <div>
                <p className="text-sm text-secondary font-semibold">Beneficiário (PME)</p>
                <p className="text-lg font-medium">{selectedProject.pme?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-secondary font-semibold">Localização</p>
                <p className="text-lg font-medium">{selectedProject.location}</p>
              </div>
              <div>
                <p className="text-sm text-secondary font-semibold">Responsável ADVZ</p>
                <p className="text-lg font-medium">Afonso Pene</p>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
              <p className="font-bold" style={{ marginBottom: '0.5rem' }}>Plano de Actividades</p>
              {selectedProject.planFileUrl ? (
                <>
                  <p>
                    <a href={selectedProject.planFileUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                      {selectedProject.planFileName || 'Descarregar plano'}
                    </a>
                    {selectedProject.planSubmittedAt && (
                      <span className="text-secondary text-sm"> — submetido em {new Date(selectedProject.planSubmittedAt).toLocaleDateString('pt-MZ')}</span>
                    )}
                    {' '}<span className={`badge ${selectedProject.planStatus === 'APPROVED' ? 'badge-success' : selectedProject.planStatus === 'RETURNED' ? '' : 'badge-warning'}`} style={selectedProject.planStatus === 'RETURNED' ? { background: '#fee2e2', color: '#b91c1c' } : {}}>{selectedProject.planStatus === 'APPROVED' ? 'Aprovado' : selectedProject.planStatus === 'RETURNED' ? 'Devolvido' : 'Pendente'}</span>
                  </p>
                  {selectedProject.planReviewNotes && (
                    <p className="text-secondary text-sm" style={{ marginTop: '0.5rem' }}>Notas: {selectedProject.planReviewNotes}</p>
                  )}
                  <div style={{ marginTop: '1rem' }}>
                    <textarea
                      className="form-input"
                      placeholder="Notas da revisão do plano..."
                      value={planNotes}
                      onChange={e => setPlanNotes(e.target.value)}
                      style={{ width: '100%', minHeight: '70px', marginBottom: '0.5rem' }}
                    />
                    <div className="flex gap-2">
                      <button className="btn btn-secondary" disabled={isLoading} onClick={() => handlePlanReview('RETURNED')}>Devolver à PME</button>
                      <button className="btn btn-primary" disabled={isLoading} onClick={() => handlePlanReview('APPROVED')}>Aprovar plano</button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-secondary">A PME ainda não submeteu o plano de actividades.</p>
              )}
            </div>

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
              <div className="flex justify-between items-center mb-4">
                <p className="font-bold">Progresso Financeiro</p>
                <p className="font-bold text-lg" style={{ color: 'var(--accent-primary)' }}>Orçamento: {new Intl.NumberFormat('pt-MZ').format(selectedProject.totalBudget)} MZN</p>
              </div>
              <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '35%', background: 'var(--accent-primary)' }}></div>
              </div>
              <p className="text-sm text-secondary" style={{ marginTop: '0.5rem', textAlign: 'right' }}>35% Executado</p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h4 className="font-bold mb-4">Cronograma e Datas</h4>
              <div className="flex justify-between p-4" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <p className="text-sm text-secondary font-semibold">Início</p>
                  <p>{new Date(selectedProject.startDate).toLocaleDateString('pt-MZ')}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary font-semibold">Término Previsto</p>
                  <p>{new Date(selectedProject.endDate).toLocaleDateString('pt-MZ')}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary font-semibold">Data de Criação no Sistema</p>
                  <p>{new Date(selectedProject.createdAt).toLocaleDateString('pt-MZ')}</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsViewModalOpen(false)}>Fechar Processo</button>
              <button type="button" className="btn btn-primary" onClick={() => setIsViewModalOpen(false)}>✏️ Editar Dados</button>
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
