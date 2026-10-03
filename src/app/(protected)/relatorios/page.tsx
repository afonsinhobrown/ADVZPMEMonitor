export default function Relatorios() {
  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
        <h2 className="text-xl font-bold">Relatórios Trimestrais</h2>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold" style={{ marginBottom: '1rem' }}>Fila de Revisão</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 className="font-bold">AS-002/2026 - Q2 2026</h4>
              <p className="text-secondary text-sm">Furo Água MZ • Submetido a 28/06/2026</p>
            </div>
            <div className="flex gap-4 items-center">
              <span className="badge badge-warning">Em Revisão</span>
              <button className="btn" style={{ border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)' }}>Avaliar Reporte</button>
            </div>
          </div>
          
          <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 className="font-bold">AS-001/2026 - Q2 2026</h4>
              <p className="text-secondary text-sm">AgroZambeze Lda • Submetido a 29/06/2026</p>
            </div>
            <div className="flex gap-4 items-center">
              <span className="badge" style={{ background: 'rgba(0,0,0,0.05)' }}>Submetido (Por Iniciar)</span>
              <button className="btn" style={{ border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)' }}>Avaliar Reporte</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
