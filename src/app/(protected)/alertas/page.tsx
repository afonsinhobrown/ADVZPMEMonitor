import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function AlertasPage() {
  const alerts = await prisma.alert.findMany({
    include: { subproject: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Alertas e Notificações</h2>
      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th>Tipo</th>
              <th>Título</th>
              <th>Mensagem</th>
              <th>Canal</th>
              <th>Estado</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map(a => (
              <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem 0' }}><span className="badge">{a.type}</span></td>
                <td>{a.title}</td>
                <td className="text-secondary">{a.message}</td>
                <td>{a.channel}</td>
                <td><span className={`badge ${a.status === 'SENT' ? 'badge-success' : 'badge-warning'}`}>{a.status}</span></td>
                <td className="text-secondary">{new Date(a.createdAt).toLocaleDateString('pt-MZ')}</td>
              </tr>
            ))}
            {alerts.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Sem alertas. Corra /api/cron/alertas para gerar.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
