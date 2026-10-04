import { scryptSync, randomBytes, timingSafeEqual, createHmac } from 'crypto';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const SECRET = process.env.AUTH_SECRET || 'advz-dev-secret-change-me';

export const AGENCY_COOKIE = 'advz_session';
export const PME_COOKIE = 'pme_session';

// ---------- Password hashing (scrypt, sem dependências externas) ----------
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!stored) return false;
  if (!stored.startsWith('scrypt:')) {
    // Compatibilidade com registos antigos em texto simples
    return stored === password;
  }
  const [, salt, hash] = stored.split(':');
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  return expected.length === candidate.length && timingSafeEqual(expected, candidate);
}

// ---------- Tokens de sessão assinados (HMAC) ----------
function sign(value: string) {
  return createHmac('sha256', SECRET).update(value).digest('hex');
}

export function createToken(userId: string) {
  const payload = `${userId}.${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function readToken(token?: string): string | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const payload = `${parts[0]}.${parts[1]}`;
  const expected = sign(payload);
  if (expected.length !== parts[2].length) return null;
  if (!timingSafeEqual(Buffer.from(expected), Buffer.from(parts[2]))) return null;
  return parts[0];
}

export async function setSession(cookieName: string, userId: string) {
  const store = await cookies();
  store.set(cookieName, createToken(userId), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 horas
  });
}

export async function clearSession(cookieName: string) {
  const store = await cookies();
  store.delete(cookieName);
}

// ---------- Utilizadores actuais ----------
export async function getAgencyUser() {
  const store = await cookies();
  const userId = readToken(store.get(AGENCY_COOKIE)?.value);
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role === 'BENEFICIARIO') return null;
  return user;
}

export async function getPmeUser() {
  const store = await cookies();
  const userId = readToken(store.get(PME_COOKIE)?.value);
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { pme: true },
  });
  if (!user || user.role !== 'BENEFICIARIO' || !user.pme) return null;
  return user;
}
