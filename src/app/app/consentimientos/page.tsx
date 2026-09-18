import Link from "next/link";
import { requireSession } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { formatFechaCorta } from "@/lib/format";

const ESTADO_STYLE: Record<string, string> = {
  PENDIENTE: "bg-slate-100 text-slate-600",
  ENVIADO: "bg-amber-100 text-amber-700",
  FIRMADO: "bg-emerald-100 text-emerald-700",
  RECHAZADO: "bg-red-100 text-red-700",
};

export default async function ConsentimientosPage() {
  const session = await requireSession();

  const consentimientos = await prisma.consentimientoInformado.findMany({
    where: { paciente: { clinicaId: session.clinicaId } },
    include: { paciente: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--brand-accent)]">Consentimientos informados</h1>
      <p className="mt-1 text-sm text-slate-500">
        Para crear uno, ve al perfil del paciente y elige &ldquo;Consentimiento&rdquo;.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Paciente</th>
              <th className="px-5 py-3">Consentimiento</th>
              <th className="px-5 py-3">Creado</th>
              <th className="px-5 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {consentimientos.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-5 py-3 text-slate-700">
                  {c.paciente.primerNombre} {c.paciente.primerApellido}
                </td>
                <td className="px-5 py-3">
                  <Link href={`/app/consentimientos/${c.id}`} className="font-semibold text-[var(--brand-primary)]">
                    {c.titulo}
                  </Link>
                </td>
                <td className="px-5 py-3 text-slate-500">{formatFechaCorta(c.createdAt)}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ESTADO_STYLE[c.estado]}`}>
                    {c.estado}
                  </span>
                </td>
              </tr>
            ))}
            {consentimientos.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-slate-400">
                  No hay consentimientos registrados.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
