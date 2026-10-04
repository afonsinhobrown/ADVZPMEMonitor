import { PrismaClient } from '@prisma/client';
import ComparacaoClient from './ComparacaoClient';

const prisma = new PrismaClient();

export default async function ComparacaoRelatoriosAdmin() {
  const projects = await prisma.subproject.findMany({
    include: { pme: true },
    orderBy: { name: 'asc' }
  });

  const pmeReports = await prisma.quarterlyReport.findMany({
    orderBy: { submissionDate: 'desc' }
  });

  const techReports = await prisma.technicalReport.findMany({
    orderBy: { submissionDate: 'desc' }
  });

  return (
    <ComparacaoClient 
      projects={projects} 
      pmeReports={pmeReports} 
      techReports={techReports} 
    />
  );
}
