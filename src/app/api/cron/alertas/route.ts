import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNotification } from '@/lib/notify';

// Gera alertas automáticos: relatórios por submeter e visitas agendadas nas próximas 48h,
// e envia os alertas pendentes por email/SMS.
export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const now = new Date();
  const in2Days = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  // Alertas de prazos de visita
  const upcomingVisits = await prisma.fieldVisit.findMany({
    where: { status: 'PLANNED', scheduledDate: { gte: now, lte: in2Days } },
    include: { subproject: true },
  });
  for (const v of upcomingVisits) {
    const exists = await prisma.alert.findFirst({
      where: { type: 'VISIT', subprojectId: v.subprojectId, dueDate: v.scheduledDate, status: { not: 'READ' } },
    });
    if (!exists) {
      await prisma.alert.create({
        data: {
          type: 'VISIT',
          title: `Visita agendada: ${v.subproject.name}`,
          message: `Visita de campo em ${v.scheduledDate.toLocaleDateString('pt-MZ')}.`,
          channel: 'EMAIL',
          dueDate: v.scheduledDate,
          subprojectId: v.subprojectId,
        },
      });
    }
  }

  // Alertas de desembolsos por autorizar
  const pendingDisb = await prisma.disbursement.count({ where: { status: 'AUTHORISED' } });
  if (pendingDisb > 0) {
    await prisma.alert.create({
      data: {
        type: 'DISBURSEMENT',
        title: `${pendingDisb} desembolso(s) por executar`,
        message: 'Existem fases de desembolso autorizadas aguardando processamento.',
        channel: 'EMAIL',
      },
    });
  }

  // Enviar pendentes
  const pending = await prisma.alert.findMany({ where: { status: 'PENDING' } });
  for (const a of pending) {
    await sendNotification(a.channel, 'gestor@advz.gov.mz', a.title, a.message);
    await prisma.alert.update({ where: { id: a.id }, data: { status: 'SENT', sentAt: new Date() } });
  }

  return NextResponse.json({ created: true, sent: pending.length });
}
