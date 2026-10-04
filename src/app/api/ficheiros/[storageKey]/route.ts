import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { AGENCY_COOKIE, PME_COOKIE, readToken } from '@/lib/auth';
import { readEvidence } from '@/lib/storage';

const CONTENT_TYPES: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

function safeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120) || 'evidencia';
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ storageKey: string }> }
) {
  const { storageKey } = await params;

  const store = await cookies();
  const sessionUserId =
    readToken(store.get(PME_COOKIE)?.value) ?? readToken(store.get(AGENCY_COOKIE)?.value);

  if (!sessionUserId) {
    return Response.json({ error: 'Sessão expirada. Autentique-se novamente.' }, { status: 401 });
  }

  const fileUrl = `/api/ficheiros/${storageKey}`;

  const attachment = await prisma.attachment.findFirst({
    where: { fileUrl },
    select: {
      id: true,
      fileName: true,
      fileType: true,
      report: {
        select: {
          submitterId: true,
          subproject: {
            select: {
              beneficiaryId: true,
              pme: { select: { userId: true } },
            },
          },
        },
      },
    },
  });

  if (!attachment || !attachment.report) {
    return Response.json({ error: 'Ficheiro não encontrado.' }, { status: 404 });
  }

  const report = attachment.report;
  const isOwner =
    report.subproject.pme?.userId === sessionUserId || report.subproject.beneficiaryId === sessionUserId;

  if (!isOwner) {
    const user = await prisma.user.findUnique({
      where: { id: sessionUserId },
      select: { role: true },
    });
    if (!user || user.role === 'BENEFICIARIO') {
      return Response.json({ error: 'Sem permissão para aceder a este ficheiro.' }, { status: 403 });
    }
  }

  const buffer = await readEvidence(storageKey);
  if (!buffer) {
    return Response.json({ error: 'Ficheiro indisponível no armazenamento.' }, { status: 404 });
  }

  const extension = storageKey.slice(storageKey.lastIndexOf('.')).toLowerCase();

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': CONTENT_TYPES[extension] ?? 'application/octet-stream',
      'Content-Length': String(buffer.byteLength),
      'Content-Disposition': `inline; filename="${safeFileName(attachment.fileName)}"`,
      'Cache-Control': 'private, no-store',
    },
  });
}