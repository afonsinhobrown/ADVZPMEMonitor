import Sidebar from '../components/Sidebar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <header className="topbar">
          <h2 className="text-lg font-semibold">Painel de Gestão</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm">Afonso Pene</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-secondary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AP</div>
          </div>
        </header>
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}
