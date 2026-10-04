import { prisma } from '@/lib/prisma';

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [headers.join(','), ...rows.map(r => headers.map(h => escape(r[h])).join(','))].join('\r\n');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get('resource') ?? 'subprojectos';

  let rows: Record<string, unknown>[] = [];

  if (resource === 'subprojectos') {
    const items = await prisma.subproject.findMany({ include: { pme: true } });
    rows = items.map(s => ({
      nome: s.name,
      acordo: s.agreementNumber,
      pme: s.pme?.name ?? '',
      orcamento: s.totalBudget,
      estado: s.status,
      inicio: s.startDate.toISOString().slice(0, 10),
      fim: s.endDate.toISOString().slice(0, 10),
    }));
  } else if (resource === 'relatorios') {
    const items = await prisma.quarterlyReport.findMany({ include: { subproject: true } });
    rows = items.map(r => ({
      projecto: r.subproject?.name ?? '',
      periodo: r.period,
      estado: r.status,
      submissao: r.submissionDate?.toISOString().slice(0, 10) ?? '',
      fundos: r.fundsUsed ?? '',
    }));
  } else if (resource === 'visitas') {
    const items = await prisma.fieldVisit.findMany({ include: { subproject: true } });
    rows = items.map(v => ({
      projecto: v.subproject?.name ?? '',
      data: v.scheduledDate.toISOString().slice(0, 10),
      estado: v.status,
      achados: v.findings ?? '',
    }));
  }

  return new Response('﻿' + toCsv(rows), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${resource}.csv"`,
    },
  });
}
