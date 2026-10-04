'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// Criar nova PME
export async function createPME(formData: FormData) {
  const name = formData.get('name') as string;
  const nif = formData.get('nif') as string;
  const sector = formData.get('sector') as string;
  const contact = formData.get('contact') as string;

  if (!name || !nif) return { success: false, error: 'Campos obrigatórios em falta' };

  try {
    // Para simplificar no MVP, criamos um utilizador dummy se não houver lógica de auth real
    // Mas assumindo que o modelo PME requer userId único:
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
  } catch (error: any) {
    console.error("Erro ao criar PME:", error);
    return { success: false, error: error.message };
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
    if (!pme) return { success: false, error: 'PME não encontrada' };

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
  } catch (error: any) {
    console.error("Erro ao criar Subprojecto:", error);
    return { success: false, error: error.message };
  }
}

// Criar Relatório Técnico
export async function createTechnicalReport(formData: FormData) {
  const subprojectId = formData.get('subprojectId') as string;
  const period = formData.get('period') as string;
  const content = formData.get('content') as string;

  try {
    // Pegar o primeiro admin/tecnico para ser o autor, só para o MVP
    const technician = await prisma.user.findFirst({
      where: { role: 'TECNICO' }
    }) || await prisma.user.findFirst();
    
    if (!technician) return { success: false, error: 'Técnico não encontrado no sistema' };

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
  } catch (error: any) {
    console.error("Erro ao criar Relatório Técnico:", error);
    return { success: false, error: error.message };
  }
}
