'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import {
  AGENCY_COOKIE,
  PME_COOKIE,
  clearSession,
  setSession,
  verifyPassword,
} from '@/lib/auth';

type AuthState = { error?: string } | undefined;

// Login da Agência (Técnicos, Decisores, Financiadores, Admin)
export async function loginAgency(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  if (!email || !password) return { error: 'Preencha o e-mail e a palavra-passe.' };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role === 'BENEFICIARIO' || !verifyPassword(password, user.password)) {
    return { error: 'Credenciais inválidas ou sem permissão de acesso à Agência.' };
  }

  await setSession(AGENCY_COOKIE, user.id);
  redirect('/dashboard');
}

// Login da PME (NUIT + código de acesso)
export async function loginPME(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const nif = String(formData.get('nif') || '').trim();
  const password = String(formData.get('password') || '');

  if (!nif || !password) return { error: 'Preencha o NUIT e o código de acesso.' };

  const pme = await prisma.pME.findUnique({ where: { nif }, include: { user: true } });
  if (!pme || !verifyPassword(password, pme.user.password)) {
    return { error: 'NUIT ou código de acesso incorrecto.' };
  }

  await setSession(PME_COOKIE, pme.userId);
  redirect('/pme');
}

export async function logoutAgency() {
  await clearSession(AGENCY_COOKIE);
  redirect('/login');
}

export async function logoutPME() {
  await clearSession(PME_COOKIE);
  redirect('/pme/login');
}
