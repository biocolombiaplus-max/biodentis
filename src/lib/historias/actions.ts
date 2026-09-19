"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/guard";
import { MENSAJE_DEMO_SOLO_LECTURA } from "@/lib/demo/constants";

export type FormState = { error?: string };

const baseSchema = z.object({
  pacienteId: z.string().min(1),
  finalidadConsulta: z.string().optional(),
  causaExterna: z.string().optional(),
  motivoConsulta: z.string().min(3, "El motivo de consulta es obligatorio"),
  enfermedadActual: z.string().optional(),
  antecedentesPersonales: z.string().optional(),
  antecedentesFamiliares: z.string().optional(),
  antecedentesOdontologicos: z.string().optional(),
  examenExtraoral: z.string().optional(),
  examenIntraoral: z.string().optional(),
  observaciones: z.string().optional(),
  recomendaciones: z.string().optional(),
  proximoControl: z.string().optional(),
  signosVitalesJson: z.string().optional(),
  odontogramaJson: z.string().optional(),
  diagnosticosJson: z.string().optional(),
  planTratamientoJson: z.string().optional(),
  procedimientosRealizadosJson: z.string().optional(),
});

function parseForm(formData: FormData) {
  return baseSchema.safeParse({
    pacienteId: formData.get("pacienteId"),
    finalidadConsulta: formData.get("finalidadConsulta") || undefined,
    causaExterna: formData.get("causaExterna") || undefined,
    motivoConsulta: formData.get("motivoConsulta"),
    enfermedadActual: formData.get("enfermedadActual") || undefined,
    antecedentesPersonales: formData.get("antecedentesPersonales") || undefined,
    antecedentesFamiliares: formData.get("antecedentesFamiliares") || undefined,
    antecedentesOdontologicos: formData.get("antecedentesOdontologicos") || undefined,
    examenExtraoral: formData.get("examenExtraoral") || undefined,
    examenIntraoral: formData.get("examenIntraoral") || undefined,
    observaciones: formData.get("observaciones") || undefined,
    recomendaciones: formData.get("recomendaciones") || undefined,
    proximoControl: formData.get("proximoControl") || undefined,
    signosVitalesJson: formData.get("signosVitalesJson") || undefined,
    odontogramaJson: formData.get("odontogramaJson") || undefined,
    diagnosticosJson: formData.get("diagnosticosJson") || undefined,
    planTratamientoJson: formData.get("planTratamientoJson") || undefined,
    procedimientosRealizadosJson: formData.get("procedimientosRealizadosJson") || undefined,
  });
}

export async function crearHistoriaAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession();
  if (session.esDemo) return { error: MENSAJE_DEMO_SOLO_LECTURA };
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa los datos del formulario" };
  }

  const paciente = await prisma.paciente.findUnique({ where: { id: parsed.data.pacienteId } });
  if (!paciente || paciente.clinicaId !== session.clinicaId) {
    return { error: "Paciente no encontrado" };
  }

  const historia = await prisma.historiaClinica.create({
    data: {
      ...parsed.data,
      proximoControl: parsed.data.proximoControl ? new Date(parsed.data.proximoControl) : null,
      clinicaId: session.clinicaId,
      profesionalId: session.userId,
    },
  });

  revalidatePath(`/app/pacientes/${paciente.id}`);
  redirect(`/app/historias/${historia.id}`);
}

export async function firmarHistoriaAction(formData: FormData) {
  const session = await requireSession();
  if (session.esDemo) return;
  const id = String(formData.get("id"));
  const firmaProfesionalUrl = String(formData.get("firmaProfesionalUrl") ?? "");

  const historia = await prisma.historiaClinica.findUnique({ where: { id } });
  if (!historia || historia.clinicaId !== session.clinicaId || historia.bloqueada) return;
  if (!firmaProfesionalUrl) return;

  await prisma.historiaClinica.update({
    where: { id },
    data: { firmaProfesionalUrl, firmadaEn: new Date(), bloqueada: true },
  });

  revalidatePath(`/app/historias/${id}`);
}
