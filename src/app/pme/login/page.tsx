'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function PmeLogin() {
  const router = useRouter();
  const [nif, setNif] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Set a fake session cookie specifically for PME
    document.cookie = "pme_session=true; path=/; max-age=86400"; // 1 day
    
    setTimeout(() => {
      setIsLoading(false);
      router.push('/pme');
    }, 800);
  };

  return (
    <div className="flex items-center justify-center" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>
            Portal do <span style={{color: 'var(--accent-primary)'}}>Beneficiário</span>
          </h1>
          <p className="text-secondary text-sm" style={{ marginBottom: '0.5rem' }}>Acesso exclusivo para PMEs</p>
          <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Acesso à Submissão de Relatórios</span>
        </div>
        
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div>
            <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.25rem' }}>
              NIF da Empresa
            </label>
            <input 
              type="text" 
              className="input" 
              placeholder="Ex: 123456789"
              value={nif}
              onChange={(e) => setNif(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.25rem' }}>Código de Acesso (Senha)</label>
            <input type="password" className="input" placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', padding: '1rem', fontSize: '1rem' }} disabled={isLoading}>
            {isLoading ? 'A autenticar...' : 'Aceder ao meu Portal'}
          </button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link href="/" className="text-sm text-secondary hover:text-primary" style={{ transition: 'color 0.2s' }}>← Voltar à Página Inicial</Link>
        </div>
      </div>
    </div>
  );
}
