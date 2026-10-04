'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    
    // Set a fake session cookie
    document.cookie = "advz_session=true; path=/; max-age=86400"; // 1 day
    
    // Simple mock logic to determine where to send the user
    if (email.toLowerCase().includes('agro')) {
      router.push('/pme');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f4f7f6, #e3e8ee)' }}>
      <div className="card glass" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="text-xl font-bold" style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>ADVZPMEMonitor</h1>
          <p className="text-secondary text-sm">Acesso Reservado - Gestão de Projectos</p>
        </div>
        
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div>
            <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.25rem' }}>E-mail institucional</label>
            <input 
              type="email" 
              className="input" 
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.25rem' }}>Palavra-passe</label>
            <input type="password" className="input" placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', background: '#22a039', color: 'white', border: 'none' }}>
            Entrar no Sistema
          </button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link href="/" className="text-sm text-secondary hover:text-primary">← Voltar à Página Inicial</Link>
        </div>
      </div>
    </div>
  );
}
