'use client';

import React, { useState } from 'react';
import type { Subproject, PME, Activity, BudgetCategory, Disbursement, QuarterlyReport } from '@prisma/client';

type Project = Subproject & {
  pme: PME | null;
  activities: Activity[];
  budgetCategories: BudgetCategory[];
  disbursements: Disbursement[];
  reports: QuarterlyReport[];
};

export default function PmeProjectList({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Meus Projectos</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {projects.map(p => (
          <div
            key={p.id}
            className="card"
            style={{ padding: '1.25rem', cursor: 'pointer', border: '1px solid var(--border)' }}
            onClick={() => setSelected(p)}
          >
            <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>{p.name}</p>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Acordo {p.agreementNumber} · {p.location}</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem' }}>
              <span className={`badge ${p.status === 'EM_CURSO' ? 'badge-success' : 'badge-warning'}`}>{p.status.replace('_', ' ')}</span>
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>Ver detalhes →</p>
          </div>
        ))}
      </div>

      {selected && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={() => setSelected(null)}
        >
          <div
            className="card"
            style={{ width: '100%', maxWidth: '800px', padding: '2rem', background: 'white', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{selected.name}</h3>
                <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>Acordo {selected.agreementNumber} · {selected.location}</p>
              </div>
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>Fechar</button>
            </div>

            <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Plano de Actividades ({selected.activities.length})</p>
            {selected.activities.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '0.4rem 0' }}>Actividade</th>
                    <th>Responsável</th>
                    <th>Início</th>
                    <th>Fim</th>
                    <th>Orçamento</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.activities.map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.5rem 0' }}>{a.description}</td>
                      <td>{a.responsible || '-'}</td>
                      <td>{a.startDate ? new Date(a.startDate).toLocaleDateString('pt-MZ') : '-'}</td>
                      <td>{a.endDate ? new Date(a.endDate).toLocaleDateString('pt-MZ') : '-'}</td>
                      <td>{a.budget != null ? a.budget.toLocaleString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>Sem actividades registadas.</p>
            )}

            <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Orçamento por Rubrica</p>
            {selected.budgetCategories.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '0.4rem 0' }}>Rubrica</th>
                    <th>Alocado</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.budgetCategories.map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.5rem 0' }}>{b.name}</td>
                      <td>{b.allocatedAmount.toLocaleString()} MT</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>Sem rubricas.</p>
            )}

            <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Desembolsos</p>
            {selected.disbursements.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '0.4rem 0' }}>Fase</th>
                    <th>Valor</th>
                    <th>Previsto</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.disbursements.map(d => (
                    <tr key={d.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.5rem 0' }}>{d.phase}</td>
                      <td>{d.amount.toLocaleString()} MT</td>
                      <td>{new Date(d.scheduledDate).toLocaleDateString('pt-MZ')}</td>
                      <td><span className="badge">{d.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>Sem desembolsos.</p>
            )}

            <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Relatórios</p>
            {selected.reports.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '0.4rem 0' }}>Período</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.reports.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.5rem 0' }}>{r.period}</td>
                      <td><span className="badge">{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-secondary">Sem relatórios.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
