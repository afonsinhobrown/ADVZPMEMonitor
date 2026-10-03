import Link from 'next/link';

export default function Login() {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f4f7f6, #e3e8ee)' }}>
      <div className="card glass" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="text-xl font-bold" style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>ADVZPMEMonitor</h1>
          <p className="text-secondary text-sm">Acesso Reservado - Gestão de Projectos</p>
        </div>
        
        <form className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.25rem' }}>E-mail institucional</label>
            <input type="email" className="input" placeholder="seu.email@exemplo.com" />
          </div>
          <div>
            <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.25rem' }}>Palavra-passe</label>
            <input type="password" className="input" placeholder="••••••••" />
          </div>
          <Link href="/dashboard" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', background: '#22a039', color: 'white' }}>
            Entrar no Sistema
          </Link>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link href="/" className="text-sm text-secondary hover:text-primary">← Voltar à Página Inicial</Link>
        </div>
      </div>
    </div>
  );
}
