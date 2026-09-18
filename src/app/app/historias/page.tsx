import Link from "next/link";
import { requireSession } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { formatFechaCorta } from "@/lib/format";

export default async function HistoriasPage() {
  const session = await requireSession();

  const historias = await prisma.historiaClinica.findMany({
    where: { clinicaId: session.clinicaId },
    include: { paciente: true, profesional: true },
    orderBy: { fechaAtencion: "desc" },
    take: 50,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--brand-accent)]">Historias clínicas</h1>
      <p className="mt-1 text-sm text-slate-500">
        Para crear una historia, ve al perfil del paciente y elige &ldquo;Nueva historia clínica&rdquo;.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3">Paciente</th>
              <th className="px-5 py-3">Motivo</th>
              <th className="px-5 py-3">Profesional</th>
              <th className="px-5 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {historias.map((h) => (
              <tr key={h.id} className="hover:bg-slate-50">
                <td className="px-5 py-3 text-slate-600">{formatFechaCorta(h.fechaAtencion)}</td>
                <td className="px-5 py-3">
                  <Link href={`/app/historias/${h.id}`} className="font-semibold text-[var(--brand-primary)]">
                    {h.paciente.primerNombre} {h.paciente.primerApellido}
                  </Link>
                </td>
                <td className="px-5 py-3 text-slate-600">{h.motivoConsulta}</td>
                <td className="px-5 py-3 text-slate-600">{h.profesional.nombre}</td>
                <td className="px-5 py-3">
                  {h.bloqueada ? (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      Firmada
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                      Borrador
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {historias.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                  No hay historias clínicas registradas.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
