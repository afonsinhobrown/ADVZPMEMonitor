import Link from 'next/link';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <header style={{ padding: '1.5rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <div style={{ width: '40px', height: '40px', background: '#22a039', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
            AdZ
          </div>
          <h1 className="text-lg font-bold" style={{ color: '#1a1f36' }}>ADVZPMEMonitor</h1>
        </div>
        <nav className="flex gap-4 items-center">
          <Link href="#" className="text-sm font-semibold text-secondary hover:text-primary">Início</Link>
          <Link href="#" className="text-sm font-semibold text-secondary hover:text-primary">Sobre a Agência</Link>
          <Link href="/pme/login" className="text-sm font-semibold text-secondary hover:text-primary" style={{ color: '#22a039' }}>Portal da PME</Link>
          <Link href="/login" className="btn" style={{ background: '#22a039', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '50px' }}>
            Acesso ao Sistema
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1 }}>
        <section style={{ 
          padding: '8rem 2rem', 
          textAlign: 'center', 
          background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop") center/cover',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ background: 'rgba(34, 160, 57, 0.2)', color: '#4dff73', padding: '0.5rem 1rem', borderRadius: '50px', fontSize: '0.875rem', fontWeight: '600', marginBottom: '1.5rem', border: '1px solid rgba(34, 160, 57, 0.5)' }}>
            Agência de Desenvolvimento do Vale do Zambeze
          </span>
          <h2 style={{ fontSize: '3.5rem', fontWeight: '800', maxWidth: '800px', lineHeight: '1.2', marginBottom: '1.5rem', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            Sistema de Gestão de Projectos e PME&apos;s
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#e3e8ee', maxWidth: '600px', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            Plataforma oficial para monitoria contínua, reporte de actividades e gestão transparente do Fundo Catalítico e apoio ao sector privado.
          </p>
          <div className="flex gap-4">
            <Link href="/login" className="btn" style={{ background: '#22a039', color: 'white', padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '8px', border: 'none', boxShadow: '0 4px 14px rgba(34, 160, 57, 0.4)' }}>
              Acesso Agência
            </Link>
            <Link href="/pme/login" className="btn" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: 'white', padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)' }}>
              Portal da PME
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" style={{ padding: '6rem 4rem', background: '#f4f7f6' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#1a1f36', marginBottom: '1rem' }}>Forjando Parcerias Estratégicas</h3>
            <p className="text-secondary" style={{ maxWidth: '600px', margin: '0 auto' }}>Acompanhe em tempo real a execução física e financeira de cada subprojecto financiado.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="card" style={{ borderTop: '4px solid #22a039' }}>
              <h4 className="text-lg font-bold" style={{ marginBottom: '0.5rem' }}>Portal da PME</h4>
              <p className="text-sm text-secondary">Acesso direto para as empresas acompanharem suas atividades em curso e submeterem anexos e evidências de forma intuitiva.</p>
            </div>
            <div className="card" style={{ borderTop: '4px solid #0076d6' }}>
              <h4 className="text-lg font-bold" style={{ marginBottom: '0.5rem' }}>Reporte Técnico</h4>
              <p className="text-sm text-secondary">Técnicos submetem e analisam relatórios trimestrais com histórico de progresso de cada projeto.</p>
            </div>
            <div className="card" style={{ borderTop: '4px solid #ffb400' }}>
              <h4 className="text-lg font-bold" style={{ marginBottom: '0.5rem' }}>Estatísticas Dinâmicas</h4>
              <p className="text-sm text-secondary">Dashboards completos indicando projetos em dia, projetos atrasados e níveis de aceitação em tempo real.</p>
            </div>
            <div className="card" style={{ borderTop: '4px solid #8e44ad' }}>
              <h4 className="text-lg font-bold" style={{ marginBottom: '0.5rem' }}>Visitas de Campo</h4>
              <p className="text-sm text-secondary">Registo de monitoria local, com fotografias georreferenciadas e operação sem ligação à internet.</p>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ background: '#1a1f36', color: '#697386', padding: '3rem 4rem', textAlign: 'center' }}>
        <p>© 2026 Agência de Desenvolvimento do Vale do Zambeze. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
