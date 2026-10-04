import React from 'react';

export default function CadastrosPME() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2 className="text-xl font-bold mb-4">Cadastros de PMEs</h2>
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <p className="text-secondary mb-4">Gerencie as Pequenas e Médias Empresas (PMEs) cadastradas no sistema.</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <input type="text" placeholder="Buscar PME..." className="form-input" style={{ width: '300px' }} />
          <button className="btn btn-primary">+ Nova PME</button>
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
    </div>
  );
}
