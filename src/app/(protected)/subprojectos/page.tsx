export default function Subprojectos() {
  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
        <h2 className="text-xl font-bold">Subprojectos</h2>
        <button className="btn btn-primary">+ Novo Subprojecto</button>
      </div>

      <div className="card">
        <div className="flex gap-4" style={{ marginBottom: '1.5rem' }}>
          <input type="text" className="input" placeholder="Pesquisar por nome ou beneficiário..." style={{ maxWidth: '400px' }} />
          <select className="input" style={{ maxWidth: '200px' }}>
            <option>Todos os Sectores</option>
            <option>Agricultura</option>
            <option>Pecuária</option>
          </select>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '1rem 0' }}>Acordo Nº</th>
              <th>Nome</th>
              <th>Beneficiário</th>
              <th>Localização</th>
              <th>Orçamento (MZN)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '1rem 0', fontWeight: '500' }}>AS-001/2026</td>
              <td>Expansão Agrícola Zambezia</td>
              <td className="text-secondary">AgroZambeze Lda</td>
              <td className="text-secondary">Mocuba</td>
              <td className="font-semibold">3,500,000.00</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '1rem 0', fontWeight: '500' }}>AS-002/2026</td>
              <td>Sistema de Irrigação</td>
              <td className="text-secondary">Furo Água MZ</td>
              <td className="text-secondary">Quelimane</td>
              <td className="font-semibold">1,250,000.00</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '1rem 0', fontWeight: '500' }}>AS-003/2026</td>
              <td>Processamento de Castanha</td>
              <td className="text-secondary">Caju do Vale</td>
              <td className="text-secondary">Gurué</td>
              <td className="font-semibold">5,100,000.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
