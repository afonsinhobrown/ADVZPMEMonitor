'use client';

import React, { useState } from 'react';
import type { QuarterlyReport, Subproject, User, PME, Expense, Attachment } from '@prisma/client';
import { reviewQuarterlyReport } from '@/app/actions';

type Row = QuarterlyReport & {
  subproject: Subproject & { pme: PME | null };
  submitter: User;
  expenses: Expense[];
  attachments: Attachment[];
};

export default function RelatoriosFilaClient({ reports }: { reports: Row[] }) {
  const [selected, setSelected] = useState<Row | null>(null);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReview = async (status: 'APPROVED' | 'RETURNED' | 'IN_REVIEW') => {
    if (!selected) return;
    setIsLoading(true);
    const result = await reviewQuarterlyReport(selected.id, status, notes);
    setIsLoading(false);
    if (result.success) {
      alert(status === 'APPROVED' ? 'Relatório aprovado. Fase de desembolso desbloqueada.' : status === 'RETURNED' ? 'Relatório devolvido à PME.' : 'Relatório em revisão.');
      setSelected(null);
      setNotes('');
      window.location.reload();
    } else {
      alert('Erro: ' + result.error);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Fila de Revisão de Relatórios Trimestrais</h2>
      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th>Projecto</th>
              <th>Período</th>
              <th>PME</th>
              <th>Submetido</th>
              <th>Status</th>
              <th>Acções</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem 0' }}>{r.subproject?.name}</td>
                <td>{r.period}</td>
                <td>{r.subproject?.pme?.name || '-'}</td>
                <td className="text-secondary">{r.submissionDate ? new Date(r.submissionDate).toLocaleDateString('pt-MZ') : '-'}</td>
                <td><span className="badge">{r.status}</span></td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => { setSelected(r); setNotes(r.reviewNotes || ''); }}>
                    Avaliar
                  </button>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Sem relatórios submetidos.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '700px', padding: '2.5rem', background: 'white', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 className="text-xl font-bold mb-2">{selected.subproject?.name} — {selected.period}</h3>
            <p className="text-secondary mb-4">Submetido por: {selected.submitter?.name || '-'} | Despesas: {selected.expenses.length} | Anexos: {selected.attachments.length}</p>
            <p style={{ whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>{selected.progressDescription || 'Sem descrição.'}</p>
            <p className="mb-4">Fundos usados: {selected.fundsUsed != null ? `${selected.fundsUsed.toLocaleString()} MT` : '-'}</p>
            <textarea className="form-input" style={{ width: '100%', minHeight: '100px' }} placeholder="Notas de revisão..." value={notes} onChange={e => setNotes(e.target.value)} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>Fechar</button>
              <button className="btn" disabled={isLoading} onClick={() => handleReview('RETURNED')}>Devolver</button>
              <button className="btn" disabled={isLoading} onClick={() => handleReview('IN_REVIEW')}>Em Revisão</button>
              <button className="btn btn-primary" disabled={isLoading} onClick={() => handleReview('APPROVED')}>Aprovar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
