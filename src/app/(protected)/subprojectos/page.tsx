'use client';

import React, { useState } from 'react';

export default function Subprojectos() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
        <h2 className="text-xl font-bold">Subprojectos</h2>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Novo Subprojecto</button>
      </div>

      <div className="card">
        <div className="flex gap-4" style={{ marginBottom: '1.5rem' }}>
          <input type="text" className="input" placeholder="Pesquisar por nome ou beneficiário..." style={{ maxWidth: '400px' }} />
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
              <th>Localização</th>
              <th>Orçamento (MZN)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '1rem 0', fontWeight: '500' }}>AS-001/2026</td>
              <td>Expansão Agrícola Zambezia</td>
              <td className="text-secondary">AgroZambeze Lda</td>
              <td className="text-secondary">Mocuba</td>
              <td className="font-semibold">3,500,000.00</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '1rem 0', fontWeight: '500' }}>AS-002/2026</td>
              <td>Sistema de Irrigação</td>
              <td className="text-secondary">Furo Água MZ</td>
              <td className="text-secondary">Quelimane</td>
              <td className="font-semibold">1,250,000.00</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '1rem 0', fontWeight: '500' }}>AS-003/2026</td>
              <td>Processamento de Castanha</td>
              <td className="text-secondary">Caju do Vale</td>
              <td className="text-secondary">Gurué</td>
              <td className="font-semibold">5,100,000.00</td>
            </tr>
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '2rem', background: 'white', borderRadius: '12px', animation: 'fadeIn 0.2s ease-in-out' }}>
            <h3 className="text-xl font-bold mb-4">Cadastrar Novo Subprojecto</h3>
            
            <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); alert("Subprojecto adicionado com sucesso!"); }}>
              <div>
                <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Nome do Projecto</label>
                <input type="text" className="form-input" style={{ width: '100%' }} placeholder="Insira o nome do projecto" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Nº de Acordo</label>
                  <input type="text" className="form-input" style={{ width: '100%' }} placeholder="Ex: AS-004/2026" required />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>PME / Beneficiário</label>
                  <select className="form-input" style={{ width: '100%' }} required>
                    <option value="">Seleccione a PME...</option>
                    <option value="1">AgroZambeze Lda</option>
                    <option value="2">Furo Água MZ</option>
                    <option value="3">Caju do Vale</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Orçamento Total (MZN)</label>
                  <input type="number" className="form-input" style={{ width: '100%' }} placeholder="0.00" required />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Localização</label>
                  <input type="text" className="form-input" style={{ width: '100%' }} placeholder="Província/Distrito" required />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Data de Início</label>
                  <input type="date" className="form-input" style={{ width: '100%' }} required />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Data de Término</label>
                  <input type="date" className="form-input" style={{ width: '100%' }} required />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#22a039', color: 'white', border: 'none' }}>Guardar Subprojecto</button>
              </div>
            </form>
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
