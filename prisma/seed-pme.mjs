// Cria dados de demonstração para o Portal do Beneficiário (PME) + subprojecto.
// Uso: node prisma/seed-pme.mjs
import { PrismaClient } from '@prisma/client';
import { scryptSync, randomBytes } from 'crypto';

const prisma = new PrismaClient();

const NIF = process.argv[2] || '5417000012';
const PASSWORD = process.argv[3] || 'Pme@2026';

function hash(password) {
  const salt = randomBytes(16).toString('hex');
  return `scrypt:${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}

const user = await prisma.user.upsert({
  where: { email: `pme_${NIF}@exemplo.mz` },
  update: { password: hash(PASSWORD), role: 'BENEFICIARIO' },
  create: {
    email: `pme_${NIF}@exemplo.mz`,
    name: 'Cooperativa Agro-Sul',
    password: hash(PASSWORD),
    role: 'BENEFICIARIO',
  },
});

const pme = await prisma.pME.upsert({
  where: { nif: NIF },
  update: {},
  create: {
    name: 'Cooperativa Agro-Sul',
    nif: NIF,
    contact: '+258 84 000 0000',
    address: 'Tete, Moçambique',
    sector: 'Agricultura',
    userId: user.id,
  },
});

const subproject = await prisma.subproject.upsert({
  where: { agreementNumber: 'ADVZ/2026/TET/001' },
  update: {},
  create: {
    name: 'Sistema de Irrigação Tete',
    description: 'Instalação de sistemas de irrigação em pequenos produtores do distrito de Tete.',
    agreementNumber: 'ADVZ/2026/TET/001',
    startDate: new Date('2026-01-15'),
    endDate: new Date('2027-07-15'),
    location: 'Tete',
    totalBudget: 5000000,
    beneficiaryId: user.id,
    pmeId: pme.id,
    status: 'EM_CURSO',
  },
});

const categories = [
  { name: 'Equipamentos e Material', allocatedAmount: 2500000 },
  { name: 'Mão-de-obra', allocatedAmount: 1200000 },
  { name: 'Formação e Capacitação', allocatedAmount: 500000 },
  { name: 'Despesas Administrativas', allocatedAmount: 800000 },
];

for (const category of categories) {
  const existing = await prisma.budgetCategory.findFirst({
    where: { subprojectId: subproject.id, name: category.name },
  });
  if (!existing) {
    await prisma.budgetCategory.create({ data: { ...category, subprojectId: subproject.id } });
  }
}

await prisma.disbursement.upsert({
  where: { id: 'seed-desembolso-1' },
  update: {},
  create: {
    id: 'seed-desembolso-1',
    phase: 'Fase 1 — Desembolso inicial',
    amount: 1750000,
    scheduledDate: new Date('2026-03-31'),
    subprojectId: subproject.id,
    status: 'COMPLETED',
  },
});

await prisma.disbursement.upsert({
  where: { id: 'seed-desembolso-2' },
  update: {},
  create: {
    id: 'seed-desembolso-2',
    phase: 'Fase 2 — Segundo desembolso',
    amount: 1750000,
    scheduledDate: new Date('2026-10-31'),
    subprojectId: subproject.id,
    status: 'PENDING',
  },
});

console.log(`Portal PME pronto`);
console.log(`  NIF: ${pme.nif}`);
console.log(`  Código de acesso: ${PASSWORD}`);
console.log(`  Projecto: ${subproject.name} (${subproject.agreementNumber})`);

await prisma.$disconnect();