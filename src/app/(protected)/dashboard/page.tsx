export default function Dashboard() {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-secondary">Total de Subprojectos</p>
          <h3 className="text-xl font-bold" style={{ marginTop: '0.5rem' }}>45</h3>
        </div>
        <div className="card">
          <p className="text-sm text-secondary">Orçamento Global Executado</p>
          <h3 className="text-xl font-bold" style={{ marginTop: '0.5rem', color: 'var(--success)' }}>34%</h3>
        </div>
        <div className="card">
          <p className="text-sm text-secondary">Relatórios Pendentes (Q1)</p>
          <h3 className="text-xl font-bold" style={{ marginTop: '0.5rem', color: 'var(--warning)' }}>12</h3>
        </div>
        <div className="card">
          <p className="text-sm text-secondary">Visitas Agendadas</p>
          <h3 className="text-xl font-bold" style={{ marginTop: '0.5rem' }}>8</h3>
        </div>
      </div>
      
      <div className="card" style={{ marginTop: '1rem' }}>
        <h3 className="text-lg font-semibold" style={{ marginBottom: '1rem' }}>Subprojectos Recentes</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '1rem 0' }}>Nome</th>
              <th>Beneficiário</th>
              <th>Data de Início</th>
              <th>Estado do Reporte</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '1rem 0', fontWeight: '500' }}>Expansão Agrícola Zambezia</td>
              <td className="text-secondary">AgroZambeze Lda</td>
              <td className="text-secondary">01/05/2026</td>
              <td><span className="badge badge-success">Aprovado</span></td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '1rem 0', fontWeight: '500' }}>Sistema de Irrigação</td>
              <td className="text-secondary">Furo Água MZ</td>
              <td className="text-secondary">15/06/2026</td>
              <td><span className="badge badge-warning">Pendente (Revisão)</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
