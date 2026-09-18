"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/guard";

export type FormState = { error?: string };

type ItemFactura = { descripcion: string; cups?: string; cantidad: number; valorUnitario: number };

export async function crearFacturaAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession();
  const pacienteId = String(formData.get("pacienteId"));
  const metodoPago = String(formData.get("metodoPago") ?? "");
  const descuento = Number(formData.get("descuento") ?? 0) || 0;
  const itemsRaw = String(formData.get("itemsJson") ?? "[]");

  let items: ItemFactura[] = [];
  try {
    items = JSON.parse(itemsRaw);
  } catch {
    return { error: "Los ítems de la factura no son válidos." };
  }
  items = items.filter((i) => i.descripcion && i.cantidad > 0 && i.valorUnitario >= 0);

  if (items.length === 0) {
    return { error: "Agrega al menos un procedimiento o concepto a facturar." };
  }

  const paciente = await prisma.paciente.findUnique({ where: { id: pacienteId } });
  if (!paciente || paciente.clinicaId !== session.clinicaId) {
    return { error: "Paciente no encontrado" };
  }

  const subtotal = items.reduce((acc, i) => acc + i.cantidad * i.valorUnitario, 0);
  const total = Math.max(subtotal - descuento, 0);

  const consecutivo = (await prisma.factura.count({ where: { clinicaId: session.clinicaId } })) + 1;
  const numero = String(consecutivo).padStart(6, "0");

  const factura = await prisma.factura.create({
    data: {
      clinicaId: session.clinicaId,
      pacienteId,
      numero,
      itemsJson: JSON.stringify(items),
      subtotal,
      descuento,
      total,
      metodoPago: metodoPago || null,
      estado: "EMITIDA",
    },
  });

  revalidatePath("/app/facturacion");
  revalidatePath(`/app/pacientes/${pacienteId}`);
  redirect(`/app/facturacion/${factura.id}`);
}

export async function marcarFacturaPagadaAction(formData: FormData) {
  const session = await requireSession();
  const id = String(formData.get("id"));

  const factura = await prisma.factura.findUnique({ where: { id } });
  if (!factura || factura.clinicaId !== session.clinicaId) return;

  await prisma.factura.update({ where: { id }, data: { estado: "PAGADA" } });
  revalidatePath(`/app/facturacion/${id}`);
  revalidatePath("/app/facturacion");
}
