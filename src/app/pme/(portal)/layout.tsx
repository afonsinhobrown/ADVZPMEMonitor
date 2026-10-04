import React from 'react';
import { redirect } from 'next/navigation';
import { getPmeUser } from '@/lib/auth';
import { logoutPME } from '@/app/auth-actions';
import PmeNav from './PmeNav';

export default async function PMELayout({ children }: { children: React.ReactNode }) {
  const user = await getPmeUser();
  if (!user || !user.pme) redirect('/pme/login');

  const initials = user.pme.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      {/* Top Navbar Exclusiva para PME */}
      <header style={{ 
        background: '#ffffff', 
        padding: '1rem 3rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '45px', 
            height: '45px', 
            background: 'linear-gradient(135deg, #22a039 0%, #167a28 100%)', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'white', 
            fontWeight: '900', 
            fontSize: '1.2rem',
            boxShadow: '0 4px 10px rgba(34, 160, 57, 0.3)'
          }}>
            PME
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Portal do Beneficiário</h1>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0, fontWeight: 500 }}>Agência de Desenvolvimento do Vale do Zambeze</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>{user.pme.name}</p>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem' }}>NUIT: {user.pme.nif}</p>
            </div>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: '#e2e8f0', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#475569'
            }}>
              {initials}
            </div>
          </div>
          <div style={{ width: '1px', height: '30px', background: '#e2e8f0' }}></div>
          <form action={logoutPME}>
            <button id="pme-logout" type="submit" style={{ color: '#ef4444', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>Sair</button>
          </form>
        </div>
      </header>

      <PmeNav />

      <main style={{ padding: '2.5rem 3rem 4rem 3rem', maxWidth: '1400px', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
}
