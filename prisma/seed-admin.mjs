// Cria (ou actualiza) o utilizador administrador inicial da Agência.
// Uso: node prisma/seed-admin.mjs [email] [password]
import { PrismaClient } from '@prisma/client';
import { scryptSync, randomBytes } from 'crypto';

const prisma = new PrismaClient();
const email = (process.argv[2] || 'admin@advz.gov.mz').toLowerCase();
const password = process.argv[3] || 'Advz@2026';

const salt = randomBytes(16).toString('hex');
const hashed = `scrypt:${salt}:${scryptSync(password, salt, 64).toString('hex')}`;

const user = await prisma.user.upsert({
  where: { email },
  update: { password: hashed, role: 'ADMIN' },
  create: { email, name: 'Administrador ADVZ', password: hashed, role: 'ADMIN' },
});

console.log(`Admin pronto: ${user.email} / ${password}`);
await prisma.$disconnect();
