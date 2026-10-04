'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ReportStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getPmeUser } from '@/lib/auth';
import { canEditReport, parseNumber } from '@/lib/format';
import { parsePeriod } from '@/lib/quarter';
import { MAX_EVIDENCE_BYTES, MAX_EVIDENCE_FILES } from '@/lib/evidence';
import { isAllowedEvidence, removeEvidence, storeEvidence } from '@/lib/storage';

const COUNTED_STATUSES: ReportStatus[] = ['SUBMITTED', 'IN_REVIEW', 'APPROVED'];

const TOLERANCE = 0.005;

export type BudgetBreach = {
  category: string;
  allocated: number;
  spent: number;
};

export type ReportFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  expenseErrors?: Record<string, string>;
  budgetBreaches?: BudgetBreach[];
};

function readText(formData: FormData, key: string): string {
  return String(formData.get(key) ?? '').trim();
}

function isRedirectError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    String((error as { digest?: unknown }).digest).startsWith('NEXT_REDIRECT')
  );
}

function parseExpenses(formData: FormData, allowedCategoryIds: Set<string>) {
  const descriptions = formData.getAll('expenseDescription').map(String);
  const amounts = formData.getAll('expenseAmount').map(String);
  const dates = formData.getAll('expenseDate').map(String);
  const categories = formData.getAll('expenseCategory').map(String);

  const expenses: { description: string; amount: number; date: Date; categoryId: string }[] = [];
  const expenseErrors: Record<string, string> = {};

  descriptions.forEach((raw, index) => {
    const description = raw.trim();
    const amountRaw = (amounts[index] ?? '').trim();
    const dateRaw = (dates[index] ?? '').trim();
    const categoryId = (categories[index] ?? '').trim();

    if (!description && !amountRaw) return;

    if (!description) {
      expenseErrors[String(index)] = 'Indique a descrição da despesa.';
      return;
    }

    const amount = parseNumber(amountRaw);
    if (!amountRaw || amount <= 0) {
      expenseErrors[String(index)] = 'Indique um valor superior a zero.';
      return;
    }

    const date = new Date(dateRaw);
    if (!dateRaw || Number.isNaN(date.getTime())) {
      expenseErrors[String(index)] = 'Indique uma data válida.';
      return;
    }

    if (!allowedCategoryIds.has(categoryId)) {
      expenseErrors[String(index)] = 'Seleccione uma rubrica do orçamento aprovado.';
      return;
    }

    expenses.push({ description, amount, date, categoryId });
  });

  return { expenses, expenseErrors };
}

async function findReport(reportId: string, pmeId: string, subprojectId: string, period: string) {
  if (reportId) {
    return prisma.quarterlyReport.findFirst({
      where: { id: reportId, subproject: { pmeId } },
      select: { id: true, status: true, period: true, subprojectId: true },
    });
  }

  return prisma.quarterlyReport.findFirst({
    where: { subprojectId, period, subproject: { pmeId } },
    select: { id: true, status: true, period: true, subprojectId: true },
  });
}

export async function submitQuarterlyReport(
  _prev: ReportFormState,
  formData: FormData
): Promise<ReportFormState> {
  const user = await getPmeUser();
  if (!user?.pme) return { error: 'A sua sessão expirou. Inicie sessão novamente.' };

  const intent = readText(formData, 'intent') === 'draft' ? 'draft' : 'submit';
  const reportId = readText(formData, 'reportId');
  const subprojectId = readText(formData, 'subprojectId');
  const period = readText(formData, 'period');

  if (!subprojectId) return { error: 'Seleccione o projecto financiado.' };
  if (!parsePeriod(period)) return { error: 'Seleccione um período trimestral válido.' };

  const subproject = await prisma.subproject.findFirst({
    where: { id: subprojectId, pmeId: user.pme.id },
    include: { budgetCategories: { orderBy: { name: 'asc' } } },
  });

  if (!subproject) {
    return { error: 'Projecto não encontrado ou não está associado à sua empresa.' };
  }

  const fieldErrors: Record<string, string> = {};
  const mainActivity = readText(formData, 'mainActivity');
  const progressDescription = readText(formData, 'progressDescription');
  const challenges = readText(formData, 'challenges');
  const safeguardsNotes = readText(formData, 'safeguardsNotes');

  if (mainActivity.length < 5) {
    fieldErrors.mainActivity = 'Descreva a actividade principal realizada (mínimo 5 caracteres).';
  }
  if (progressDescription.length < 30) {
    fieldErrors.progressDescription = 'Descreva o progresso físico com detalhe (mínimo 30 caracteres).';
  }

  const { expenses, expenseErrors } = parseExpenses(
    formData,
    new Set(subproject.budgetCategories.map((category) => category.id))
  );

  if (Object.keys(fieldErrors).length > 0 || Object.keys(expenseErrors).length > 0) {
    return { fieldErrors, expenseErrors };
  }

  const existing = await findReport(reportId, user.pme.id, subproject.id, period);

  if (existing && !canEditReport(existing.status)) {
    return {
      error: 'Este relatório já foi submetido à Agência e está em análise. Não é possível alterá-lo.',
    };
  }

  const committed = await prisma.expense.groupBy({
    by: ['categoryId'],
    where: {
      category: { subprojectId: subproject.id },
      report: { status: { in: COUNTED_STATUSES } },
      ...(existing ? { reportId: { not: existing.id } } : {}),
    },
    _sum: { amount: true },
  });

  const committedByCategory = new Map(
    committed.map((row) => [row.categoryId, row._sum.amount ?? 0])
  );
  const allocatedByCategory = new Map(
    subproject.budgetCategories.map((category) => [category.id, category.allocatedAmount])
  );
  const nameByCategory = new Map(
    subproject.budgetCategories.map((category) => [category.id, category.name])
  );

  const totalsThisReport = new Map<string, number>();
  for (const expense of expenses) {
    totalsThisReport.set(
      expense.categoryId,
      (totalsThisReport.get(expense.categoryId) ?? 0) + expense.amount
    );
  }

  const budgetBreaches: BudgetBreach[] = [];
  for (const [categoryId, amount] of totalsThisReport) {
    const allocated = allocatedByCategory.get(categoryId) ?? 0;
    const alreadyCommitted = committedByCategory.get(categoryId) ?? 0;
    const spent = alreadyCommitted + amount;
    if (spent > allocated + TOLERANCE) {
      budgetBreaches.push({
        category: nameByCategory.get(categoryId) ?? 'Rubrica desconhecida',
        allocated,
        spent,
      });
    }
  }

  if (intent === 'submit' && budgetBreaches.length > 0) {
    return { budgetBreaches };
  }

  const files = formData
    .getAll('evidencias')
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  const existingAttachments = existing
    ? await prisma.attachment.count({ where: { reportId: existing.id } })
    : 0;

  if (existingAttachments + files.length > MAX_EVIDENCE_FILES) {
    return {
      error: `Pode anexar no maximo ${MAX_EVIDENCE_FILES} evidências por relatório.`,
    };
  }

  for (const file of files) {
    if (!isAllowedEvidence(file)) {
      return { error: `Formato não suportado: "${file.name}". Use PDF, JPG, PNG, XLSX ou DOCX.` };
    }
    if (file.size > MAX_EVIDENCE_BYTES) {
      return { error: `O ficheiro "${file.name}" excede o limite de 5 MB.` };
    }
  }

  const totalEvidence = existingAttachments + files.length;
  if (intent === 'submit' && totalEvidence === 0) {
    return { error: 'É obrigatório anexar pelo menos uma evidência para submeter o relatório.' };
  }

  const fundsUsed = expenses.reduce((total, expense) => total + expense.amount, 0);
  const status: ReportStatus = intent === 'submit' ? 'SUBMITTED' : 'DRAFT';

  const stored: { fileUrl: string; fileName: string; fileType: string; size: number }[] = [];

  try {
    for (const file of files) {
      const result = await storeEvidence(file);
      stored.push({
        fileUrl: result.fileUrl,
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
        size: file.size,
      });
    }

    const report = await prisma.$transaction(async (tx) => {
      const payload = {
        period,
        mainActivity,
        progressDescription,
        challenges: challenges || null,
        safeguardsNotes: safeguardsNotes || null,
        fundsUsed,
        status,
        ...(intent === 'submit'
          ? { submissionDate: new Date(), reviewNotes: null, reviewedAt: null }
          : {}),
      };

      const saved = existing
        ? await tx.quarterlyReport.update({ where: { id: existing.id }, data: payload })
        : await tx.quarterlyReport.create({
            data: { ...payload, subprojectId: subproject.id, submitterId: user.id },
          });

      await tx.expense.deleteMany({ where: { reportId: saved.id } });

      if (expenses.length > 0) {
        await tx.expense.createMany({
          data: expenses.map((expense) => ({ ...expense, reportId: saved.id })),
        });
      }

      if (stored.length > 0) {
        await tx.attachment.createMany({
          data: stored.map((attachment) => ({ ...attachment, reportId: saved.id })),
        });
      }

      return saved;
    });

    revalidatePath('/pme');
    revalidatePath('/pme/relatorios');
    revalidatePath(`/pme/relatorios/${report.id}`);

    redirect(
      intent === 'submit'
        ? '/pme/relatorios?aviso=submetido'
        : `/pme/relatorios/${report.id}?aviso=rascunho`
    );
  } catch (error) {
    await Promise.all(stored.map((file) => removeEvidence(file.fileUrl)));

    if (isRedirectError(error)) throw error;

    return {
      error: 'Não foi possível gravar o relatório. Verifique a ligação e tente novamente.',
    };
  }
}

export async function deleteQuarterlyReport(formData: FormData): Promise<void> {
  const user = await getPmeUser();
  if (!user?.pme) redirect('/pme/login');

  const reportId = readText(formData, 'reportId');

  const report = await prisma.quarterlyReport.findFirst({
    where: { id: reportId, subproject: { pmeId: user.pme.id } },
    include: { attachments: { select: { fileUrl: true } } },
  });

  if (!report) redirect('/pme/relatorios');
  if (!canEditReport(report.status)) {
    redirect(`/pme/relatorios/${report.id}?aviso=bloqueado`);
  }

  await prisma.$transaction([
    prisma.attachment.deleteMany({ where: { reportId: report.id } }),
    prisma.expense.deleteMany({ where: { reportId: report.id } }),
    prisma.quarterlyReport.delete({ where: { id: report.id } }),
  ]);

  await Promise.all(report.attachments.map((file) => removeEvidence(file.fileUrl)));

  revalidatePath('/pme');
  revalidatePath('/pme/relatorios');
  redirect('/pme/relatorios?aviso=eliminado');
}

export async function removeReportEvidence(formData: FormData): Promise<void> {
  const user = await getPmeUser();
  if (!user?.pme) redirect('/pme/login');

  const attachmentId = readText(formData, 'attachmentId');

  const attachment = await prisma.attachment.findFirst({
    where: {
      id: attachmentId,
      report: { subproject: { pmeId: user.pme.id } },
    },
    include: { report: { select: { id: true, status: true } } },
  });

  if (!attachment?.report) redirect('/pme/relatorios');

  const report = attachment.report;
  if (!canEditReport(report.status)) redirect('/pme/relatorios');

  await prisma.attachment.delete({ where: { id: attachment.id } });
  await removeEvidence(attachment.fileUrl);

  revalidatePath(`/pme/relatorios/${report.id}`);
  redirect(`/pme/relatorios/${report.id}`);
}
export async function uploadActivityPlan(formData: FormData): Promise<void> {
  const user = await getPmeUser();
  if (!user?.pme) redirect('/pme/login');

  const subprojectId = readText(formData, 'subprojectId');
  const file = formData.get('plan');

  if (!(file instanceof File) || file.size === 0 || !isAllowedEvidence(file)) {
    redirect('/pme?aviso=plano-invalido');
  }

  const subproject = await prisma.subproject.findFirst({
    where: { id: subprojectId, pmeId: user.pme.id },
  });
  if (!subproject) redirect('/pme');

  if (subproject.planFileUrl) {
    await removeEvidence(subproject.planFileUrl);
  }

  const stored = await storeEvidence(file);

  await prisma.subproject.update({
    where: { id: subproject.id },
    data: { planFileName: file.name, planFileUrl: stored.fileUrl, planSubmittedAt: new Date(), planStatus: 'PENDING', planReviewNotes: null },
  });

  revalidatePath('/pme');
  revalidatePath('/subprojectos');
  redirect('/pme?aviso=plano-submetido');
}
