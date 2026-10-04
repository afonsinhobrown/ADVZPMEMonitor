'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { loginPME } from '@/app/auth-actions';

export default function PmeLogin() {
  const [state, formAction, isLoading] = useActionState(loginPME, undefined);

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
        
        <form className="flex flex-col gap-4" action={formAction}>
          <div>
            <label htmlFor="pme-nif" className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.25rem' }}>
              NUIT da Empresa
            </label>
            <input id="pme-nif" name="nif" type="text" className="input" placeholder="Ex: 123456789" required />
          </div>
          <div>
            <label htmlFor="pme-password" className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.25rem' }}>Código de Acesso (Senha)</label>
            <input id="pme-password" name="password" type="password" className="input" placeholder="••••••••" required />
          </div>
          {state?.error && (
            <div role="alert" style={{ background: '#fef2f2', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid #fecaca' }}>
              {state.error}
            </div>
          )}
          <button id="pme-login-submit" type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', padding: '1rem', fontSize: '1rem' }} disabled={isLoading}>
            {isLoading ? 'A autenticar...' : 'Aceder ao meu Portal'}
          </button>
        </form>
        <p className="text-secondary text-sm" style={{ marginTop: '1rem', textAlign: 'center' }}>
          O código de acesso é fornecido pela ADVZ no momento do cadastro.
        </p>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Link href="/" className="text-sm text-secondary hover:text-primary" style={{ transition: 'color 0.2s' }}>← Voltar à Página Inicial</Link>
        </div>
      </div>
    </div>
  );
}
