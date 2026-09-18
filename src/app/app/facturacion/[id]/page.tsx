import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/guard";
import { getClinicaActiva } from "@/lib/clinica";
import { prisma } from "@/lib/prisma";
import { marcarFacturaPagadaAction } from "@/lib/facturacion/actions";
import { formatCOP, formatFechaCorta } from "@/lib/format";

type Item = { descripcion: string; cups?: string; cantidad: number; valorUnitario: number };

export default async function FacturaDetallePage({ params }: PageProps<"/app/facturacion/[id]">) {
  const session = await requireSession();
  const { id } = await params;

  const [factura, clinica] = await Promise.all([
    prisma.factura.findUnique({ where: { id }, include: { paciente: true } }),
    getClinicaActiva(),
  ]);
  if (!factura || factura.clinicaId !== session.clinicaId) notFound();

  const items: Item[] = JSON.parse(factura.itemsJson);

  return (
    <div className="max-w-2xl">
      <div className="rounded-2xl border border-black/5 bg-white p-8 print:border-none print:shadow-none">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-[var(--brand-accent)]">{clinica?.nombre}</h1>
            <p className="text-xs text-slate-500">NIT {clinica?.nit}</p>
            <p className="text-xs text-slate-500">{clinica?.direccion}, {clinica?.ciudad}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-500">Factura</p>
            <p className="text-lg font-bold text-[var(--brand-primary)]">#{factura.numero}</p>
            <p className="text-xs text-slate-400">{formatFechaCorta(factura.createdAt)}</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm">
          <p className="font-semibold text-slate-700">
            {factura.paciente.primerNombre} {factura.paciente.primerApellido}
          </p>
          <p className="text-slate-500">
            {factura.paciente.tipoDocumento} {factura.paciente.numeroDocumento}
          </p>
        </div>

        <table className="mt-6 w-full text-left text-sm">
          <thead className="border-b border-black/10 text-xs uppercase text-slate-400">
            <tr>
              <th className="py-2">Concepto</th>
              <th className="py-2 text-center">Cant.</th>
              <th className="py-2 text-right">Valor unit.</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {items.map((item, i) => (
              <tr key={i}>
                <td className="py-2">
                  {item.descripcion}
                  {item.cups ? <span className="ml-1 text-xs text-slate-400">CUPS {item.cups}</span> : null}
                </td>
                <td className="py-2 text-center">{item.cantidad}</td>
                <td className="py-2 text-right">{formatCOP(item.valorUnitario)}</td>
                <td className="py-2 text-right">{formatCOP(item.cantidad * item.valorUnitario)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 ml-auto max-w-[220px] space-y-1 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span>{formatCOP(factura.subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Descuento</span>
            <span>-{formatCOP(factura.descuento)}</span>
          </div>
          <div className="flex justify-between border-t border-black/10 pt-1 text-base font-bold text-[var(--brand-accent)]">
            <span>Total</span>
            <span>{formatCOP(factura.total)}</span>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          Documento equivalente de venta. Método de pago: {factura.metodoPago ?? "No especificado"}.
        </p>
      </div>

      <div className="mt-4 flex gap-3 print:hidden">
        {factura.estado !== "PAGADA" ? (
          <form action={marcarFacturaPagadaAction}>
            <input type="hidden" name="id" value={factura.id} />
            <button className="rounded-xl bg-[var(--brand-accent)] px-4 py-2.5 text-sm font-semibold text-white">
              Marcar como pagada
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
