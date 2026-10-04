import { PrismaClient } from '@prisma/client';
import RelatoriosFilaClient from './RelatoriosFilaClient';

const prisma = new PrismaClient();

export default async function RelatoriosPage() {
  const reports = await prisma.quarterlyReport.findMany({
    include: {
      subproject: { include: { pme: true } },
      submitter: true,
      expenses: true,
      attachments: true,
    },
    orderBy: { submissionDate: 'desc' },
  });

  return <RelatoriosFilaClient reports={reports} />;
}
