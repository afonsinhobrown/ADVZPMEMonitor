'use client';

import React, { useState } from 'react';
import { createPME } from '@/app/actions';

export default function PmeClient({ pmes }: { pmes: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await createPME(formData);
    
    setIsLoading(false);
    
    if (result.success) {
      alert("PME registada com sucesso!");
      setIsModalOpen(false);
    } else {
      alert("Erro ao criar PME: " + result.error);
    }
  };

  const filteredPmes = pmes.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: '2rem' }}>
      <h2 className="text-xl font-bold mb-4">Cadastros de PMEs</h2>
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <p className="text-secondary mb-4">Gerencie as Pequenas e Médias Empresas (PMEs) cadastradas no sistema.</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <input 
            type="text" 
            placeholder="Buscar PME..." 
            className="form-input" 
            style={{ width: '300px' }} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Nova PME</button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>Nome da PME</th>
              <th style={{ padding: '1rem' }}>NIF</th>
              <th style={{ padding: '1rem' }}>Sector</th>
              <th style={{ padding: '1rem' }}>Contacto</th>
              <th style={{ padding: '1rem' }}>ID no Sistema</th>
            </tr>
          </thead>
          <tbody>
            {filteredPmes.map((pme) => (
              <tr key={pme.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem' }}>{pme.name}</td>
                <td style={{ padding: '1rem' }}>{pme.nif}</td>
                <td style={{ padding: '1rem' }}>{pme.sector}</td>
                <td style={{ padding: '1rem' }}>{pme.contact}</td>
                <td style={{ padding: '1rem' }}>
                  <code style={{ background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{pme.id}</code>
                </td>
              </tr>
            ))}
            {filteredPmes.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  Nenhuma PME encontrada.
                </td>
              </tr>
            )}
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
            
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Nome da Empresa</label>
                <input type="text" name="name" className="form-input" style={{ width: '100%' }} placeholder="Insira o nome" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>NIF</label>
                  <input type="text" name="nif" className="form-input" style={{ width: '100%' }} placeholder="Número de Identificação" required />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Sector</label>
                  <select name="sector" className="form-input" style={{ width: '100%' }}>
                    <option>Agricultura</option>
                    <option>Pescas</option>
                    <option>Tecnologia</option>
                    <option>Indústria</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Contacto Telefónico</label>
                <input type="text" name="contact" className="form-input" style={{ width: '100%' }} placeholder="+258 ..." />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#22a039', color: 'white', border: 'none' }} disabled={isLoading}>
                  {isLoading ? 'A Guardar...' : 'Guardar'}
                </button>
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
