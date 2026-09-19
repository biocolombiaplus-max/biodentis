"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/guard";
import { MENSAJE_DEMO_SOLO_LECTURA } from "@/lib/demo/constants";

export type FormState = { error?: string };

export async function crearConsentimientoAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession();
  if (session.esDemo) return { error: MENSAJE_DEMO_SOLO_LECTURA };
  const pacienteId = String(formData.get("pacienteId"));
  const plantillaId = String(formData.get("plantillaId") || "");
  const titulo = String(formData.get("titulo") ?? "").trim();
  const contenido = String(formData.get("contenido") ?? "").trim();

  if (!titulo || !contenido) {
    return { error: "El título y el contenido del consentimiento son obligatorios." };
  }

  const paciente = await prisma.paciente.findUnique({ where: { id: pacienteId } });
  if (!paciente || paciente.clinicaId !== session.clinicaId) {
    return { error: "Paciente no encontrado" };
  }

  const consentimiento = await prisma.consentimientoInformado.create({
    data: {
      pacienteId,
      plantillaId: plantillaId || null,
      titulo,
      contenido,
    },
  });

  revalidatePath(`/app/pacientes/${pacienteId}`);
  redirect(`/app/consentimientos/${consentimiento.id}`);
}

export async function generarEnlaceFirmaAction(formData: FormData) {
  const session = await requireSession();
  if (session.esDemo) return;
  const id = String(formData.get("id"));

  const consentimiento = await prisma.consentimientoInformado.findUnique({
    where: { id },
    include: { paciente: true },
  });
  if (!consentimiento || consentimiento.paciente.clinicaId !== session.clinicaId) return;

  await prisma.consentimientoInformado.update({
    where: { id },
    data: {
      tokenFirmaRemota: crypto.randomBytes(24).toString("hex"),
      estado: "ENVIADO",
      enviadoEn: new Date(),
    },
  });

  revalidatePath(`/app/consentimientos/${id}`);
}

export async function firmarEnConsultorioAction(formData: FormData) {
  const session = await requireSession();
  if (session.esDemo) return;
  const id = String(formData.get("id"));
  const firmaPacienteBase64 = String(formData.get("firmaPacienteBase64") ?? "");
  const nombreTestigo = String(formData.get("nombreTestigo") ?? "");
  const firmaTestigoBase64 = String(formData.get("firmaTestigoBase64") ?? "");

  if (!firmaPacienteBase64) return;

  const consentimiento = await prisma.consentimientoInformado.findUnique({
    where: { id },
    include: { paciente: true },
  });
  if (!consentimiento || consentimiento.paciente.clinicaId !== session.clinicaId) return;

  await prisma.consentimientoInformado.update({
    where: { id },
    data: {
      firmaPacienteBase64,
      nombreTestigo: nombreTestigo || null,
      firmaTestigoBase64: firmaTestigoBase64 || null,
      estado: "FIRMADO",
      firmadoEn: new Date(),
      dispositivo: "Dispositivo del consultorio",
    },
  });

  revalidatePath(`/app/consentimientos/${id}`);
}

export type FirmaRemotaState = { error?: string; ok?: boolean };

export async function firmarRemotoAction(_prev: FirmaRemotaState, formData: FormData): Promise<FirmaRemotaState> {
  const token = String(formData.get("token") ?? "");
  const firmaPacienteBase64 = String(formData.get("firmaPacienteBase64") ?? "");

  if (!firmaPacienteBase64) {
    return { error: "Debes firmar antes de continuar." };
  }

  const consentimiento = await prisma.consentimientoInformado.findUnique({ where: { tokenFirmaRemota: token } });
  if (!consentimiento) {
    return { error: "Enlace inválido o vencido." };
  }
  if (consentimiento.estado === "FIRMADO") {
    return { ok: true };
  }

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") ?? headerList.get("x-real-ip") ?? "";
  const dispositivo = headerList.get("user-agent") ?? "";

  await prisma.consentimientoInformado.update({
    where: { id: consentimiento.id },
    data: {
      firmaPacienteBase64,
      estado: "FIRMADO",
      firmadoEn: new Date(),
      ip,
      dispositivo,
    },
  });

  revalidatePath(`/app/consentimientos/${consentimiento.id}`);
  return { ok: true };
}
