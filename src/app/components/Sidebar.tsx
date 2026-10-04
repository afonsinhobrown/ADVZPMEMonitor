'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span style={{ color: 'var(--accent-primary)' }}>ADVZ</span>Monitor
        <div style={{ marginTop: '0.5rem' }}>
          <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Técnico UGF</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        <Link href="/dashboard" className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}>
          <span style={{ marginRight: '0.75rem', fontSize: '1.2rem' }}>📊</span> Dashboard
        </Link>
        <Link href="/pmes" className={`sidebar-link ${isActive('/pmes') ? 'active' : ''}`}>
          <span style={{ marginRight: '0.75rem', fontSize: '1.2rem' }}>🏢</span> Cadastros PMEs
        </Link>
        <Link href="/subprojectos" className={`sidebar-link ${isActive('/subprojectos') ? 'active' : ''}`}>
          <span style={{ marginRight: '0.75rem', fontSize: '1.2rem' }}>📋</span> Subprojectos
        </Link>
        <Link href="/relatorios-tecnicos" className={`sidebar-link ${isActive('/relatorios-tecnicos') ? 'active' : ''}`}>
          <span style={{ marginRight: '0.75rem', fontSize: '1.2rem' }}>📝</span> Meus Relatórios
        </Link>
        <Link href="/comparacao-relatorios" className={`sidebar-link ${isActive('/comparacao-relatorios') ? 'active' : ''}`} style={isActive('/comparacao-relatorios') ? {} : { color: '#fbbf24' }}>
          <span style={{ marginRight: '0.75rem', fontSize: '1.2rem' }}>⚖️</span> Comparação (Admin)
        </Link>
        
        <div style={{ marginTop: '1.5rem', marginBottom: '0.5rem', padding: '0 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--border-dark)', fontWeight: 'bold' }}>
          Análise
        </div>
        
        <Link href="/estatisticas" className={`sidebar-link ${isActive('/estatisticas') ? 'active' : ''}`}>
          <span style={{ marginRight: '0.75rem', fontSize: '1.2rem' }}>📈</span> Estatísticas
        </Link>
        <Link href="/visitas" className={`sidebar-link ${isActive('/visitas') ? 'active' : ''}`}>
          <span style={{ marginRight: '0.75rem', fontSize: '1.2rem' }}>🚗</span> Visitas de Campo
        </Link>
      </nav>
      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-dark)' }}>
        <Link href="/" className="sidebar-link" style={{ padding: '0.5rem' }}>
          <span style={{ marginRight: '0.75rem', fontSize: '1.2rem' }}>🚪</span> Sair da Sessão
        </Link>
      </div>
    </aside>
  );
}
