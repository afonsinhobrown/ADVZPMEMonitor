import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <h2 className="text-lg font-bold" style={{ color: 'var(--accent-primary)' }}>ADVZPMEMonitor</h2>
        <span className="badge badge-success" style={{ marginTop: '0.5rem', display: 'inline-block' }}>Técnico UGF</span>
      </div>
      <nav style={{ padding: '1rem 0' }}>
        <ul style={{ listStyle: 'none' }}>
          <li style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', borderLeft: '3px solid var(--accent-primary)', background: 'rgba(0, 118, 214, 0.05)' }}>
            <Link href="/dashboard" className="font-semibold" style={{ color: 'var(--accent-primary)' }}>Dashboard</Link>
          </li>
          <li style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', borderLeft: '3px solid transparent' }}>
            <Link href="/pmes" className="text-secondary hover:text-primary">Cadastros PMEs</Link>
          </li>
          <li style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', borderLeft: '3px solid transparent' }}>
            <Link href="/subprojectos" className="text-secondary hover:text-primary">Projectos / Subprojectos</Link>
          </li>
          <li style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', borderLeft: '3px solid transparent' }}>
            <Link href="/relatorios-tecnicos" className="text-secondary hover:text-primary">Relatórios do Técnico</Link>
          </li>
          <li style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', borderLeft: '3px solid transparent' }}>
            <Link href="/comparacao-relatorios" className="font-semibold text-secondary hover:text-primary" style={{ color: 'var(--warning)' }}>Comparação (Admin)</Link>
          </li>
          <li style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', borderLeft: '3px solid transparent' }}>
            <Link href="/estatisticas" className="text-secondary hover:text-primary">Estatísticas</Link>
          </li>
          <li style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', borderLeft: '3px solid transparent' }}>
            <Link href="/relatorios" className="text-secondary hover:text-primary">Outros Relatórios</Link>
          </li>
          <li style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', borderLeft: '3px solid transparent' }}>
            <Link href="/visitas" className="text-secondary hover:text-primary">Visitas de Campo</Link>
          </li>
        </ul>
      </nav>
      <div style={{ marginTop: 'auto', padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
        <Link href="/" className="text-sm text-secondary">Sair da Sessão</Link>
      </div>
    </aside>
  );
}
