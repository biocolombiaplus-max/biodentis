"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/guard";

export type FormState = { error?: string };

export async function crearCitaAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession();
  const pacienteId = String(formData.get("pacienteId") ?? "");
  const fechaHora = String(formData.get("fechaHora") ?? "");
  const duracionMin = Number(formData.get("duracionMin") ?? 30) || 30;
  const motivo = String(formData.get("motivo") ?? "");

  if (!pacienteId || !fechaHora) {
    return { error: "Selecciona el paciente y la fecha de la cita." };
  }

  const paciente = await prisma.paciente.findUnique({ where: { id: pacienteId } });
  if (!paciente || paciente.clinicaId !== session.clinicaId) {
    return { error: "Paciente no encontrado" };
  }

  await prisma.cita.create({
    data: {
      clinicaId: session.clinicaId,
      pacienteId,
      profesionalId: session.userId,
      fechaHora: new Date(fechaHora),
      duracionMin,
      motivo: motivo || null,
    },
  });

  revalidatePath("/app/citas");
  redirect("/app/citas");
}

const ESTADOS_VALIDOS = ["PROGRAMADA", "CONFIRMADA", "ATENDIDA", "CANCELADA", "NO_ASISTIO"] as const;

export async function actualizarEstadoCitaAction(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id"));
  const estado = String(formData.get("estado"));
  if (!ESTADOS_VALIDOS.includes(estado as (typeof ESTADOS_VALIDOS)[number])) return;

  const cita = await prisma.cita.findUnique({ where: { id } });
  if (!cita || cita.clinicaId !== session.clinicaId) return;

  await prisma.cita.update({ where: { id }, data: { estado: estado as (typeof ESTADOS_VALIDOS)[number] } });
  revalidatePath("/app/citas");
}
