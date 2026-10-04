'use client';

import React, { useState } from 'react';

export default function CadastrosPME() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ padding: '2rem' }}>
      <h2 className="text-xl font-bold mb-4">Cadastros de PMEs</h2>
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <p className="text-secondary mb-4">Gerencie as Pequenas e Médias Empresas (PMEs) cadastradas no sistema.</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <input type="text" placeholder="Buscar PME..." className="form-input" style={{ width: '300px' }} />
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Nova PME</button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>Nome da PME</th>
              <th style={{ padding: '1rem' }}>NIF</th>
              <th style={{ padding: '1rem' }}>Sector</th>
              <th style={{ padding: '1rem' }}>Contacto</th>
              <th style={{ padding: '1rem' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '1rem' }}>Agro Lda</td>
              <td style={{ padding: '1rem' }}>123456789</td>
              <td style={{ padding: '1rem' }}>Agricultura</td>
              <td style={{ padding: '1rem' }}>923 456 789</td>
              <td style={{ padding: '1rem' }}>
                <button className="btn btn-secondary" style={{ marginRight: '0.5rem' }}>Ver</button>
                <button className="btn btn-secondary">Editar</button>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '1rem' }}>Tech Solutions</td>
              <td style={{ padding: '1rem' }}>987654321</td>
              <td style={{ padding: '1rem' }}>Tecnologia</td>
              <td style={{ padding: '1rem' }}>912 345 678</td>
              <td style={{ padding: '1rem' }}>
                <button className="btn btn-secondary" style={{ marginRight: '0.5rem' }}>Ver</button>
                <button className="btn btn-secondary">Editar</button>
              </td>
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
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '2rem', background: 'white', borderRadius: '12px', animation: 'fadeIn 0.2s ease-in-out' }}>
            <h3 className="text-xl font-bold mb-4">Cadastrar Nova PME</h3>
            
            <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); alert("PME registada com sucesso!"); }}>
              <div>
                <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Nome da Empresa</label>
                <input type="text" className="form-input" style={{ width: '100%' }} placeholder="Insira o nome" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>NIF</label>
                  <input type="text" className="form-input" style={{ width: '100%' }} placeholder="Número de Identificação" required />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Sector</label>
                  <select className="form-input" style={{ width: '100%' }}>
                    <option>Agricultura</option>
                    <option>Pescas</option>
                    <option>Tecnologia</option>
                    <option>Indústria</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Contacto Telefónico</label>
                <input type="text" className="form-input" style={{ width: '100%' }} placeholder="+258 ..." />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#22a039', color: 'white', border: 'none' }}>Guardar</button>
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
