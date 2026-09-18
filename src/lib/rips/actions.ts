"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/guard";
import { generarArchivosRips } from "@/lib/rips/generar";

export type FormState = { error?: string };

export async function generarRipsAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession();
  const periodoInicio = String(formData.get("periodoInicio") ?? "");
  const periodoFin = String(formData.get("periodoFin") ?? "");

  if (!periodoInicio || !periodoFin) {
    return { error: "Selecciona el periodo a reportar." };
  }

  const inicio = new Date(periodoInicio);
  const fin = new Date(periodoFin);
  fin.setHours(23, 59, 59, 999);

  const { ac, ap, us, totalRegistros } = await generarArchivosRips(session.clinicaId, inicio, fin);

  if (totalRegistros === 0) {
    return { error: "No hay atenciones registradas en ese periodo para generar el RIPS." };
  }

  await prisma.ripsExport.create({
    data: {
      clinicaId: session.clinicaId,
      periodoInicio: inicio,
      periodoFin: fin,
      tipo: "AC-AP-US",
      contenido: JSON.stringify({ ac, ap, us }),
      totalRegistros,
    },
  });

  revalidatePath("/app/rips");
  return {};
}
