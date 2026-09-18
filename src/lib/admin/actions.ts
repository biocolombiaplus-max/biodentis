"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guard";
import { saveUploadedImage } from "@/lib/uploads/save-upload";

export type FormState = { error?: string; ok?: boolean };

const marcaSchema = z.object({
  nombre: z.string().min(2, "El nombre es obligatorio"),
  nit: z.string().optional(),
  slogan: z.string().optional(),
  telefono: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email("Correo inválido").or(z.literal("")).optional(),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  colorPrimario: z.string().min(4),
  colorSecundario: z.string().min(4),
  colorAcento: z.string().min(4),
});

export async function updateMarcaAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireRole(["ADMIN"]);

  const parsed = marcaSchema.safeParse({
    nombre: formData.get("nombre"),
    nit: formData.get("nit") ?? undefined,
    slogan: formData.get("slogan") ?? undefined,
    telefono: formData.get("telefono") ?? undefined,
    whatsapp: formData.get("whatsapp") ?? undefined,
    email: formData.get("email") ?? undefined,
    direccion: formData.get("direccion") ?? undefined,
    ciudad: formData.get("ciudad") ?? undefined,
    colorPrimario: formData.get("colorPrimario"),
    colorSecundario: formData.get("colorSecundario"),
    colorAcento: formData.get("colorAcento"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const data: Record<string, unknown> = { ...parsed.data };

  const logo = formData.get("logo");
  if (logo instanceof File && logo.size > 0) {
    try {
      data.logoUrl = await saveUploadedImage(logo, "logo");
    } catch (e) {
      return { error: e instanceof Error ? e.message : "No se pudo subir el logo" };
    }
  }

  const favicon = formData.get("favicon");
  if (favicon instanceof File && favicon.size > 0) {
    try {
      data.faviconUrl = await saveUploadedImage(favicon, "favicon");
    } catch (e) {
      return { error: e instanceof Error ? e.message : "No se pudo subir el favicon" };
    }
  }

  await prisma.clinica.update({ where: { id: session.clinicaId }, data });

  revalidatePath("/");
  revalidatePath("/admin/marca");
  return { ok: true };
}

export async function updateSeccionAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireRole(["ADMIN"]);

  const id = String(formData.get("id"));
  const titulo = String(formData.get("titulo") ?? "");
  const subtitulo = String(formData.get("subtitulo") ?? "");
  const visible = formData.get("visible") === "on";

  const seccion = await prisma.seccionLanding.findUnique({ where: { id } });
  if (!seccion || seccion.clinicaId !== session.clinicaId) {
    return { error: "Sección no encontrada" };
  }

  const data: Record<string, unknown> = { titulo, subtitulo, visible };

  const imagen = formData.get("imagenFondo");
  if (imagen instanceof File && imagen.size > 0) {
    try {
      data.imagenFondoUrl = await saveUploadedImage(imagen, `seccion-${seccion.clave}`);
    } catch (e) {
      return { error: e instanceof Error ? e.message : "No se pudo subir la imagen" };
    }
  }

  if (formData.get("quitarImagen") === "on") {
    data.imagenFondoUrl = null;
  }

  await prisma.seccionLanding.update({ where: { id }, data });

  revalidatePath("/");
  revalidatePath("/admin/secciones");
  return { ok: true };
}

const planSchema = z.object({
  id: z.string(),
  nombre: z.string().min(2),
  descripcion: z.string().optional(),
  precioMensual: z.coerce.number().int().min(0),
  precioAnual: z.coerce.number().int().min(0).optional(),
  destacado: z.boolean(),
  activo: z.boolean(),
  caracteristicas: z.string(),
});

export async function updatePlanAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireRole(["ADMIN"]);

  const parsed = planSchema.safeParse({
    id: formData.get("id"),
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion") ?? undefined,
    precioMensual: formData.get("precioMensual"),
    precioAnual: formData.get("precioAnual") || undefined,
    destacado: formData.get("destacado") === "on",
    activo: formData.get("activo") === "on",
    caracteristicas: formData.get("caracteristicas"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const caracteristicasArray = parsed.data.caracteristicas
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (parsed.data.destacado) {
    await prisma.plan.updateMany({ data: { destacado: false }, where: { NOT: { id: parsed.data.id } } });
  }

  await prisma.plan.update({
    where: { id: parsed.data.id },
    data: {
      nombre: parsed.data.nombre,
      descripcion: parsed.data.descripcion,
      precioMensual: parsed.data.precioMensual,
      precioAnual: parsed.data.precioAnual,
      destacado: parsed.data.destacado,
      activo: parsed.data.activo,
      caracteristicas: JSON.stringify(caracteristicasArray),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/planes");
  return { ok: true };
}

export async function upsertTestimonioAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireRole(["ADMIN"]);

  const id = formData.get("id");
  const nombre = String(formData.get("nombre") ?? "").trim();
  const cargo = String(formData.get("cargo") ?? "").trim();
  const texto = String(formData.get("texto") ?? "").trim();
  const visible = formData.get("visible") === "on";

  if (!nombre || !texto) {
    return { error: "Nombre y testimonio son obligatorios" };
  }

  if (id && typeof id === "string" && id.length > 0) {
    await prisma.testimonio.update({ where: { id }, data: { nombre, cargo, texto, visible } });
  } else {
    const count = await prisma.testimonio.count({ where: { clinicaId: session.clinicaId } });
    await prisma.testimonio.create({
      data: { clinicaId: session.clinicaId, nombre, cargo, texto, visible, orden: count + 1 },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/testimonios");
  return { ok: true };
}

export async function eliminarTestimonioAction(formData: FormData) {
  await requireRole(["ADMIN"]);
  const id = String(formData.get("id"));
  await prisma.testimonio.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/testimonios");
}
