import { randomUUID } from 'crypto';
import { mkdir, readFile, unlink, writeFile } from 'fs/promises';
import path from 'path';
import { MAX_EVIDENCE_BYTES } from './evidence';

const UPLOAD_DIR = path.join(process.cwd(), '.uploads');

const ALLOWED_TYPES: Record<string, string> = {
  'application/pdf': '.pdf',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
};

export function isAllowedEvidence(file: File): boolean {
  return file.type in ALLOWED_TYPES;
}

export type StoredEvidence = {
  key: string;
  fileUrl: string;
};

export async function storeEvidence(file: File): Promise<StoredEvidence> {
  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    throw new Error(`Tipo de ficheiro não suportado: ${file.type || 'desconhecido'}`);
  }
  if (file.size > MAX_EVIDENCE_BYTES) {
    throw new Error(`O ficheiro "${file.name}" excede o limite de 5 MB.`);
  }

  const key = `${randomUUID()}${extension}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, key), Buffer.from(await file.arrayBuffer()));

  return { key, fileUrl: `/api/ficheiros/${key}` };
}

export function evidenceKeyFromUrl(fileUrl: string): string | null {
  const prefix = '/api/ficheiros/';
  if (!fileUrl.startsWith(prefix)) return null;
  return fileUrl.slice(prefix.length);
}

export async function readEvidence(key: string): Promise<Buffer | null> {
  const safeKey = path.basename(key);
  if (safeKey !== key) return null;
  try {
    return await readFile(path.join(UPLOAD_DIR, safeKey));
  } catch {
    return null;
  }
}

export async function removeEvidence(fileUrl: string): Promise<void> {
  const key = evidenceKeyFromUrl(fileUrl);
  if (!key) return;
  await unlink(path.join(UPLOAD_DIR, path.basename(key))).catch(() => undefined);
}