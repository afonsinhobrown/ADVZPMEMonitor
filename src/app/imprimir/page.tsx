import { prisma } from '@/lib/prisma';
import PrintButton from './PrintButton';

export default async function ImprimirPage() {
  const subprojects = await prisma.subproject.findMany({
    include: { pme: true, disbursements: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '2rem', color: '#111', background: '#fff' }}>
      <h1>ADVZ — Relatório Consolidado de Subprojectos</h1>
      <p>Gerado em: {new Date().toLocaleDateString('pt-MZ')}</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }} border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>Subprojecto</th>
            <th>Acordo</th>
            <th>PME</th>
            <th>Orçamento (MT)</th>
            <th>Estado</th>
            <th>Desembolsos</th>
          </tr>
        </thead>
        <tbody>
          {subprojects.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.agreementNumber}</td>
              <td>{s.pme?.name ?? '-'}</td>
              <td>{s.totalBudget.toLocaleString()}</td>
              <td>{s.status}</td>
              <td>{s.disbursements.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <PrintButton />
    </div>
  );
}
