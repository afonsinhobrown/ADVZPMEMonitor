'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Erro desconhecido';
}

// Criar nova PME
export async function createPME(formData: FormData) {
  const name = formData.get('name') as string;
  const nif = formData.get('nif') as string;
  const sector = formData.get('sector') as string;
  const contact = formData.get('contact') as string;

  if (!name || !nif) return { success: false, error: 'Campos obrigatÃ³rios em falta' };

  try {
    // Para simplificar no MVP, criamos um utilizador dummy se nÃ£o houver lÃ³gica de auth real
    // Mas assumindo que o modelo PME requer userId Ãºnico:
    const dummyUser = await prisma.user.create({
      data: {
        email: `pme_${nif}@exemplo.com`,
        name: name,
        password: 'senha_provisoria',
        role: 'BENEFICIARIO'
      }
    });

    const newPme = await prisma.pME.create({
      data: {
        name,
        nif,
        sector,
        contact,
        userId: dummyUser.id,
      },
    });

    revalidatePath('/pmes');
    return { success: true, data: newPme };
  } catch (error: unknown) {
    console.error("Erro ao criar PME:", error);
    return { success: false, error: errorMessage(error) };
  }
}

// Criar Novo Subprojecto
export async function createSubproject(formData: FormData) {
  const name = formData.get('name') as string;
  const agreementNumber = formData.get('agreementNumber') as string;
  const pmeId = formData.get('pmeId') as string;
  const totalBudget = parseFloat(formData.get('totalBudget') as string);
  const location = formData.get('location') as string;
  const startDate = new Date(formData.get('startDate') as string);
  const endDate = new Date(formData.get('endDate') as string);

  try {
    // Procuramos a PME para extrair o beneficiaryId (UserId)
    const pme = await prisma.pME.findUnique({ where: { id: pmeId }});
    if (!pme) return { success: false, error: 'PME nÃ£o encontrada' };

    const newProject = await prisma.subproject.create({
      data: {
        name,
        agreementNumber,
        pmeId: pme.id,
        beneficiaryId: pme.userId,
        totalBudget,
        location,
        startDate,
        endDate,
        status: 'EM_CURSO'
      }
    });
    
    revalidatePath('/subprojectos');
    return { success: true, data: newProject };
  } catch (error: unknown) {
    console.error("Erro ao criar Subprojecto:", error);
    return { success: false, error: errorMessage(error) };
  }
}

// Criar RelatÃ³rio TÃ©cnico
export async function createTechnicalReport(formData: FormData) {
  const subprojectId = formData.get('subprojectId') as string;
  const period = formData.get('period') as string;
  const content = formData.get('content') as string;

  try {
    // Pegar o primeiro admin/tecnico para ser o autor, sÃ³ para o MVP
    const technician = await prisma.user.findFirst({
      where: { role: 'TECNICO' }
    }) || await prisma.user.findFirst();
    
    if (!technician) return { success: false, error: 'TÃ©cnico nÃ£o encontrado no sistema' };

    const newReport = await prisma.technicalReport.create({
      data: {
        subprojectId,
        period,
        content,
        technicianId: technician.id,
        status: 'SUBMITTED',
        submissionDate: new Date()
      }
    });

    revalidatePath('/relatorios-tecnicos');
    return { success: true, data: newReport };
  } catch (error: unknown) {
    console.error("Erro ao criar RelatÃ³rio TÃ©cnico:", error);
    return { success: false, error: errorMessage(error) };
  }
}

// Criar Visita de Campo
export async function createFieldVisit(formData: FormData) {
  const subprojectId = formData.get('subprojectId') as string;
  const scheduledDate = new Date(formData.get('scheduledDate') as string);
  const findings = formData.get('findings') as string;

  try {
    const inspector = await prisma.user.findFirst({
      where: { role: 'TECNICO' }
    }) || await prisma.user.findFirst();
    
    if (!inspector) return { success: false, error: 'Inspector nÃ£o encontrado' };

    const newVisit = await prisma.fieldVisit.create({
      data: {
        subprojectId,
        scheduledDate,
        findings,
        inspectorId: inspector.id,
        status: 'PLANNED',
      }
    });

    revalidatePath('/visitas');
    return { success: true, data: newVisit };
  } catch (error: unknown) {
    console.error("Erro ao agendar Visita de Campo:", error);
    return { success: false, error: errorMessage(error) };
  }
}

// Rever relatório trimestral (fila da agência)
export async function reviewQuarterlyReport(reportId: string, status: 'APPROVED' | 'RETURNED' | 'IN_REVIEW', reviewNotes: string) {
  try {
    const report = await prisma.quarterlyReport.update({
      where: { id: reportId },
      data: { status, reviewNotes: reviewNotes || null, reviewedAt: new Date() },
    });

    // Aprovação desbloqueia a próxima fase de desembolso do subprojecto
    if (status === 'APPROVED') {
      const next = await prisma.disbursement.findFirst({
        where: { subprojectId: report.subprojectId, status: 'PENDING' },
        orderBy: { scheduledDate: 'asc' },
      });
      if (next) {
        await prisma.disbursement.update({
          where: { id: next.id },
          data: { status: 'AUTHORISED' },
        });
      }
    }

    revalidatePath('/relatorios');
    return { success: true, data: report };
  } catch (error: unknown) {
    console.error('Erro ao rever relatório:', error);
    return { success: false, error: errorMessage(error) };
  }
}
