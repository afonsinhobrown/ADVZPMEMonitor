import { PrismaClient } from '@prisma/client';
import PmeClient from './PmeClient';

const prisma = new PrismaClient();

export default async function CadastrosPME() {
  const pmes = await prisma.pME.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return <PmeClient pmes={pmes} />;
}
