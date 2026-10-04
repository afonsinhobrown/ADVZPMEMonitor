'use client';

import React, { useState } from 'react';
import type { Subproject, PME, Activity, BudgetCategory, Disbursement, QuarterlyReport } from '@prisma/client';
import { addActivity, removeActivity, savePlanDraft, submitActivityPlan } from '@/app/pme/actions';
import { formatDate, formatMZN } from '@/lib/format';

type Project = Subproject & {
  pme?: PME | null;
  activities: Activity[];
  budgetCategories: BudgetCategory[];
  disbursements: Disbursement[];
  reports: QuarterlyReport[];
};

export default function PmeProjectList({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'actividades' | 'orcamento' | 'desembolsos' | 'relatorios'>('actividades');
  const [newActivity, setNewActivity] = useState({ description: '', responsible: '', startDate: '', endDate: '', budget: '', indicator: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleAddActivity = async (e: React.FormEvent, subprojectId: string) => {
    e.preventDefault();
    if (!newActivity.description.trim()) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append('subprojectId', subprojectId);
    formData.append('description', newActivity.description);
    formData.append('responsible', newActivity.responsible);
    formData.append('startDate', newActivity.startDate);
    formData.append('endDate', newActivity.endDate);
    formData.append('budget', newActivity.budget);
    formData.append('indicator', newActivity.indicator);
    await addActivity(formData);
    setNewActivity({ description: '', responsible: '', startDate: '', endDate: '', budget: '', indicator: '' });
    setIsLoading(false);
    window.location.reload();
  };

  const handleRemoveActivity = async (activityId: string) => {
    if (!confirm('Remover esta actividade?')) return;
    const formData = new FormData();
    formData.append('activityId', activityId);
    await removeActivity(formData);
    window.location.reload();
  };

  const handleSaveDraft = async (subprojectId: string) => {
    await savePlanDraft(subprojectId);
    window.location.reload();
  };

  const handleSubmitPlan = async (subprojectId: string) => {
    if (!confirm('Submeter plano para análise da ADVZ?')) return;
    await submitActivityPlan(subprojectId);
    window.location.reload();
  };

  if (!selected) return null;

  const canEdit = selected.planStatus !== 'APPROVED';

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onClick={() => setSelected(null)}
    >
      <div
        className="card"
        style={{ width: '100%', maxWidth: '900px', padding: '2rem', background: 'white', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{selected.name}</h3>
            <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>Acordo {selected.agreementNumber} · {selected.location}</p>
          </div>
          <button className="btn btn-secondary" onClick={() => setSelected(null)}>Fechar</button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
          {(['actividades', 'orcamento', 'desembolsos', 'relatorios'] as const).map(tab => (
            <button
              key={tab}
              className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#64748b' }}>
            Estado: <strong>{selected.planStatus === 'DRAFT' ? 'Rascunho' : selected.planStatus === 'PENDING' ? 'Submetido (em análise)' : selected.planStatus === 'APPROVED' ? 'Aprovado' : 'Devolvido'}</strong>
            {selected.planSubmittedAt ? ` · submetido em ${formatDate(selected.planSubmittedAt)}` : ''}
          </span>
        </div>

        {activeTab === 'actividades' && (
          <div>
            {selected.planReviewNotes && selected.planStatus === 'RETURNED' && (
              <p style={{ marginBottom: '1rem', padding: '0.75rem', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c', fontSize: '0.85rem' }}>
                <strong>Devolvido pela ADVZ:</strong> {selected.planReviewNotes}
              </p>
            )}
            {selected.planStatus === 'APPROVED' && (
              <p style={{ marginBottom: '1rem', padding: '0.75rem', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '8px', color: '#166534', fontSize: '0.85rem' }}>
                <strong>Plano aprovado pela ADVZ.</strong>
              </p>
            )}

            {selected.activities.length > 0 && (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '0.5rem 0' }}>Actividade</th>
                    <th>Responsável</th>
                    <th>Início</th>
                    <th>Fim</th>
                    <th>Orçamento</th>
                    <th>Indicador</th>
                    {canEdit && <th></th>}
                  </tr>
                </thead>
                <tbody>
                  {selected.activities.map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.5rem 0' }}>{a.description}</td>
                      <td>{a.responsible || '-'}</td>
                      <td>{a.startDate ? formatDate(a.startDate) : '-'}</td>
                      <td>{a.endDate ? formatDate(a.endDate) : '-'}</td>
                      <td>{a.budget != null ? formatMZN(a.budget) : '-'}</td>
                      <td>{a.indicator || '-'}</td>
                      {canEdit && (
                        <td>
                          <button
                            type="button"
                            onClick={() => handleRemoveActivity(a.id)}
                            style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', fontSize: '0.8rem' }}
                          >
                            Remover
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {canEdit && (
              <form onSubmit={e => handleAddActivity(e, selected.id)} style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <input className="form-input" placeholder="Descrição da actividade *" value={newActivity.description} onChange={e => setNewActivity({...newActivity, description: e.target.value})} required />
                <input className="form-input" placeholder="Responsável" value={newActivity.responsible} onChange={e => setNewActivity({...newActivity, responsible: e.target.value})} />
                <input className="form-input" type="date" placeholder="Início" value={newActivity.startDate} onChange={e => setNewActivity({...newActivity, startDate: e.target.value})} />
                <input className="form-input" type="date" placeholder="Fim" value={newActivity.endDate} onChange={e => setNewActivity({...newActivity, endDate: e.target.value})} />
                <input className="form-input" type="number" step="0.01" placeholder="Orçamento (MT)" value={newActivity.budget} onChange={e => setNewActivity({...newActivity, budget: e.target.value})} />
                <input className="form-input" placeholder="Indicador" value={newActivity.indicator} onChange={e => setNewActivity({...newActivity, indicator: e.target.value})} />
                <button type="submit" className="btn btn-secondary" disabled={isLoading} style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
                  {isLoading ? 'A adicionar...' : '+ Adicionar actividade'}
                </button>
              </form>
            )}

            {canEdit && (
              <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <button className="btn btn-secondary" onClick={() => handleSaveDraft(selected.id)} style={{ padding: '0.5rem 1rem' }}>Guardar rascunho</button>
                <button className="btn btn-primary" onClick={() => handleSubmitPlan(selected.id)} style={{ padding: '0.5rem 1rem' }}>Submeter plano</button>
              </div>
            )}

            {!canEdit && selected.activities.length === 0 && (
              <p className="text-secondary" style={{ marginTop: '1rem' }}>Sem actividades registadas.</p>
            )}
          </div>
        )}

        {activeTab === 'orcamento' && (
          <div>
            {selected.budgetCategories.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '0.5rem 0' }}>Rubrica</th>
                    <th>Alocado</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.budgetCategories.map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.5rem 0' }}>{b.name}</td>
                      <td>{formatMZN(b.allocatedAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-secondary">Sem rubricas orçamentais.</p>
            )}
          </div>
        )}

        {activeTab === 'desembolsos' && (
          <div>
            {selected.disbursements.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '0.5rem 0' }}>Fase</th>
                    <th>Valor</th>
                    <th>Previsto</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.disbursements.map(d => (
                    <tr key={d.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.5rem 0' }}>{d.phase}</td>
                      <td>{formatMZN(d.amount)}</td>
                      <td>{formatDate(d.scheduledDate)}</td>
                      <td><span className="badge">{d.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-secondary">Sem desembolsos.</p>
            )}
          </div>
        )}

        {activeTab === 'relatorios' && (
          <div>
            {selected.reports.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '0.5rem 0' }}>Período</th>
                    <th>Estado</th>
                    <th>Submetido</th>
                    <th>Fundos</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.reports.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.5rem 0' }}>{r.period}</td>
                      <td><span className="badge">{r.status}</span></td>
                      <td>{r.submissionDate ? formatDate(r.submissionDate) : '-'}</td>
                      <td>{r.fundsUsed != null ? formatMZN(r.fundsUsed) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-secondary">Sem relatórios.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}