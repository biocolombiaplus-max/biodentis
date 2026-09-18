"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/guard";

export type FormState = { error?: string };

const pacienteSchema = z.object({
  tipoDocumento: z.enum(["RC", "TI", "CC", "CE", "PA", "PEP", "MS", "AS", "CN"]),
  numeroDocumento: z.string().min(3, "El número de documento es obligatorio"),
  primerNombre: z.string().min(1, "El primer nombre es obligatorio"),
  segundoNombre: z.string().optional(),
  primerApellido: z.string().min(1, "El primer apellido es obligatorio"),
  segundoApellido: z.string().optional(),
  fechaNacimiento: z.string().min(1, "La fecha de nacimiento es obligatoria"),
  sexo: z.enum(["M", "F"]),
  genero: z.string().optional(),
  regimenAfiliacion: z.enum(["CONTRIBUTIVO", "SUBSIDIADO", "ESPECIAL", "EXCEPCION", "PARTICULAR", "NO_ASEGURADO"]),
  eps: z.string().optional(),
  zonaResidencia: z.string().optional(),
  departamento: z.string().optional(),
  municipio: z.string().optional(),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  celular: z.string().optional(),
  email: z.string().email().or(z.literal("")).optional(),
  ocupacion: z.string().optional(),
  acudienteNombre: z.string().optional(),
  acudienteTelefono: z.string().optional(),
  grupoEtnico: z.string().optional(),
  discapacidad: z.string().optional(),
  habeasDataAceptado: z.boolean(),
});

function parseForm(formData: FormData) {
  return pacienteSchema.safeParse({
    tipoDocumento: formData.get("tipoDocumento"),
    numeroDocumento: formData.get("numeroDocumento"),
    primerNombre: formData.get("primerNombre"),
    segundoNombre: formData.get("segundoNombre") || undefined,
    primerApellido: formData.get("primerApellido"),
    segundoApellido: formData.get("segundoApellido") || undefined,
    fechaNacimiento: formData.get("fechaNacimiento"),
    sexo: formData.get("sexo"),
    genero: formData.get("genero") || undefined,
    regimenAfiliacion: formData.get("regimenAfiliacion"),
    eps: formData.get("eps") || undefined,
    zonaResidencia: formData.get("zonaResidencia") || undefined,
    departamento: formData.get("departamento") || undefined,
    municipio: formData.get("municipio") || undefined,
    direccion: formData.get("direccion") || undefined,
    telefono: formData.get("telefono") || undefined,
    celular: formData.get("celular") || undefined,
    email: formData.get("email") || undefined,
    ocupacion: formData.get("ocupacion") || undefined,
    acudienteNombre: formData.get("acudienteNombre") || undefined,
    acudienteTelefono: formData.get("acudienteTelefono") || undefined,
    grupoEtnico: formData.get("grupoEtnico") || undefined,
    discapacidad: formData.get("discapacidad") || undefined,
    habeasDataAceptado: formData.get("habeasDataAceptado") === "on",
  });
}

export async function crearPacienteAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa los datos del formulario" };
  }
  if (!parsed.data.habeasDataAceptado) {
    return { error: "Debes registrar la aceptación de tratamiento de datos personales (Habeas Data)." };
  }

  const existente = await prisma.paciente.findUnique({
    where: {
      clinicaId_tipoDocumento_numeroDocumento: {
        clinicaId: session.clinicaId,
        tipoDocumento: parsed.data.tipoDocumento,
        numeroDocumento: parsed.data.numeroDocumento,
      },
    },
  });
  if (existente) {
    return { error: "Ya existe un paciente con ese tipo y número de documento." };
  }

  const paciente = await prisma.paciente.create({
    data: {
      ...parsed.data,
      fechaNacimiento: new Date(parsed.data.fechaNacimiento),
      clinicaId: session.clinicaId,
    },
  });

  revalidatePath("/app/pacientes");
  redirect(`/app/pacientes/${paciente.id}`);
}

export async function actualizarPacienteAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession();
  const id = String(formData.get("id"));
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa los datos del formulario" };
  }

  const paciente = await prisma.paciente.findUnique({ where: { id } });
  if (!paciente || paciente.clinicaId !== session.clinicaId) {
    return { error: "Paciente no encontrado" };
  }

  await prisma.paciente.update({
    where: { id },
    data: { ...parsed.data, fechaNacimiento: new Date(parsed.data.fechaNacimiento) },
  });

  revalidatePath("/app/pacientes");
  revalidatePath(`/app/pacientes/${id}`);
  redirect(`/app/pacientes/${id}`);
}
