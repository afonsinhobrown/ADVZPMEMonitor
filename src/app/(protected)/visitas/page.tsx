import { PrismaClient } from '@prisma/client';
import VisitasClient from './VisitasClient';

const prisma = new PrismaClient();

export default async function VisitasPage() {
  const visits = await prisma.fieldVisit.findMany({
    include: { 
      subproject: true,
      inspector: true
    },
    orderBy: { scheduledDate: 'desc' }
  });

  const projects = await prisma.subproject.findMany({
    orderBy: { name: 'asc' }
  });

  return <VisitasClient visits={visits} projects={projects} />;
}
