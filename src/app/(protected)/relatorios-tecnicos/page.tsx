import { PrismaClient } from '@prisma/client';
import RelatoriosClient from './RelatoriosClient';

const prisma = new PrismaClient();

export default async function RelatoriosTecnicos() {
  const reports = await prisma.technicalReport.findMany({
    include: { 
      subproject: true,
      technician: true
    },
    orderBy: { submissionDate: 'desc' }
  });

  const projects = await prisma.subproject.findMany({
    orderBy: { name: 'asc' }
  });

  return <RelatoriosClient reports={reports} projects={projects} />;
}
