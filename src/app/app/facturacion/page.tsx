import Link from "next/link";
import { requireSession } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { formatCOP, formatFechaCorta } from "@/lib/format";

const ESTADO_STYLE: Record<string, string> = {
  BORRADOR: "bg-slate-100 text-slate-600",
  EMITIDA: "bg-amber-100 text-amber-700",
  PAGADA: "bg-emerald-100 text-emerald-700",
  ANULADA: "bg-red-100 text-red-700",
};

export default async function FacturacionPage() {
  const session = await requireSession();

  const facturas = await prisma.factura.findMany({
    where: { clinicaId: session.clinicaId },
    include: { paciente: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const totalMes = facturas
    .filter((f) => f.createdAt.getMonth() === new Date().getMonth() && f.estado !== "ANULADA")
    .reduce((acc, f) => acc + f.total, 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--brand-accent)]">Facturación</h1>
          <p className="mt-1 text-sm text-slate-500">Total facturado este mes: {formatCOP(totalMes)}</p>
        </div>
        <Link href="/app/pacientes" className="brand-gradient rounded-xl px-4 py-2.5 text-sm font-semibold text-white">
          Facturar a un paciente
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Número</th>
              <th className="px-5 py-3">Paciente</th>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {facturas.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50">
                <td className="px-5 py-3">
                  <Link href={`/app/facturacion/${f.id}`} className="font-semibold text-[var(--brand-primary)]">
                    #{f.numero}
                  </Link>
                </td>
                <td className="px-5 py-3 text-slate-600">
                  {f.paciente.primerNombre} {f.paciente.primerApellido}
                </td>
                <td className="px-5 py-3 text-slate-500">{formatFechaCorta(f.createdAt)}</td>
                <td className="px-5 py-3 font-medium text-slate-700">{formatCOP(f.total)}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ESTADO_STYLE[f.estado]}`}>
                    {f.estado}
                  </span>
                </td>
              </tr>
            ))}
            {facturas.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                  No hay facturas registradas.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
