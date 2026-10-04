'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Set a fake session cookie
    document.cookie = "advz_session=true; path=/; max-age=86400"; // 1 day
    
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className="flex items-center justify-center" style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <div className="card glass" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', borderRadius: 'var(--radius-lg)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>ADVZ<span style={{color: 'white'}}>Monitor</span></h1>
          <p className="text-secondary text-sm" style={{ marginBottom: '0.5rem' }}>Acesso Restrito - Agência</p>
          <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Acesso para Técnicos e Gestores</span>
        </div>
        
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div>
            <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.25rem', color: 'white' }}>
              E-mail Institucional
            </label>
            <input 
              type="email" 
              className="input" 
              placeholder="tecnico@advz.gov.mz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.9)', color: '#000', border: 'none' }}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.25rem', color: 'white' }}>Palavra-passe</label>
            <input type="password" className="input" placeholder="••••••••" required style={{ background: 'rgba(255,255,255,0.9)', color: '#000', border: 'none' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', color: 'white', border: 'none', padding: '1rem', fontSize: '1rem' }} disabled={isLoading}>
            {isLoading ? 'A autenticar...' : 'Entrar no Portal da Agência'}
          </button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link href="/" className="text-sm text-secondary hover:text-primary" style={{ transition: 'color 0.2s' }}>← Voltar à Página Inicial</Link>
        </div>
      </div>
    </div>
  );
}
