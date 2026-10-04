import { PrismaClient } from '@prisma/client';
import SubprojectosClient from './SubprojectosClient';

const prisma = new PrismaClient();

export default async function Subprojectos() {
  const subprojectos = await prisma.subproject.findMany({
    include: { pme: true, activities: { orderBy: { order: 'asc' } } },
    orderBy: { createdAt: 'desc' }
  });

  const pmes = await prisma.pME.findMany({
    orderBy: { name: 'asc' }
  });

  return <SubprojectosClient subprojectos={subprojectos} pmes={pmes} />;
}
