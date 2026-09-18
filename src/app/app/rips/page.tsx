import { requireSession } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { RipsForm } from "@/components/rips/rips-form";
import { formatFechaCorta } from "@/lib/format";

export default async function RipsPage() {
  const session = await requireSession();

  const exports_ = await prisma.ripsExport.findMany({
    where: { clinicaId: session.clinicaId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--brand-accent)]">RIPS</h1>
      <p className="mt-1 max-w-2xl text-sm text-slate-500">
        Genera los archivos de Registro Individual de Prestación de Servicios de Salud a partir de tus historias
        clínicas. Esta es una estructura base: valida los archivos contra el anexo técnico vigente antes de
        reportarlos oficialmente.
      </p>

      <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6">
        <RipsForm />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Periodo</th>
              <th className="px-5 py-3">Registros</th>
              <th className="px-5 py-3">Generado</th>
              <th className="px-5 py-3">Archivo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {exports_.map((e) => (
              <tr key={e.id}>
                <td className="px-5 py-3 text-slate-600">
                  {formatFechaCorta(e.periodoInicio)} — {formatFechaCorta(e.periodoFin)}
                </td>
                <td className="px-5 py-3 text-slate-600">{e.totalRegistros}</td>
                <td className="px-5 py-3 text-slate-500">{formatFechaCorta(e.createdAt)}</td>
                <td className="px-5 py-3">
                  <a
                    href={`/app/rips/${e.id}/descargar`}
                    className="font-semibold text-[var(--brand-primary)]"
                  >
                    Descargar .txt
                  </a>
                </td>
              </tr>
            ))}
            {exports_.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-slate-400">
                  Aún no has generado archivos RIPS.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
