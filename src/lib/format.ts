import type { ReportStatus } from '@prisma/client';

const mzn = new Intl.NumberFormat('pt-PT', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const mznShort = new Intl.NumberFormat('pt-PT', {
  maximumFractionDigits: 0,
});

export function formatMZN(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '0,00';
  return mzn.format(value);
}

export function formatMZNShort(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '0';
  return mznShort.format(value);
}

export function parseNumber(value: FormDataEntryValue | null): number {
  if (typeof value !== 'string') return 0;
  const cleaned = value.replace(/\s/g, '').replace(',', '.');
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(value: Date | string | null | undefined): string {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function toDateInputValue(value: Date | string | null | undefined): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function percentage(part: number, total: number): number {
  if (!total) return 0;
  return Math.min(100, Math.max(0, (part / total) * 100));
}

export type StatusMeta = {
  label: string;
  bg: string;
  fg: string;
  hint: string;
};

export const REPORT_STATUS: Record<ReportStatus, StatusMeta> = {
  DRAFT: {
    label: 'Rascunho',
    bg: '#f1f5f9',
    fg: '#475569',
    hint: 'Só você vê este relatório. Ainda pode ser alterado.',
  },
  SUBMITTED: {
    label: 'Submetido',
    bg: '#dbeafe',
    fg: '#1d4ed8',
    hint: 'A aguardar validação técnica da Agência.',
  },
  IN_REVIEW: {
    label: 'Em Revisão',
    bg: '#fef3c7',
    fg: '#b45309',
    hint: 'Um técnico da Agência está a analisar o relatório.',
  },
  RETURNED: {
    label: 'Devolvido',
    bg: '#fee2e2',
    fg: '#b91c1c',
    hint: 'A Agência devolveu o relatório. Corrija e submeta novamente.',
  },
  APPROVED: {
    label: 'Aprovado',
    bg: '#dcfce7',
    fg: '#166534',
    hint: 'Relatório validado. Execução financeira desbloqueada.',
  },
};

export const EDITABLE_STATUSES: ReportStatus[] = ['DRAFT', 'RETURNED'];

export function canEditReport(status: ReportStatus): boolean {
  return EDITABLE_STATUSES.includes(status);
}