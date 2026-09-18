import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { requireSession } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { formatFechaCorta } from "@/lib/format";

export default async function PacientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await requireSession();
  const { q } = await searchParams;

  const pacientes = await prisma.paciente.findMany({
    where: {
      clinicaId: session.clinicaId,
      ...(q
        ? {
            OR: [
              { primerNombre: { contains: q } },
              { primerApellido: { contains: q } },
              { numeroDocumento: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--brand-accent)]">Pacientes</h1>
          <p className="mt-1 text-sm text-slate-500">{pacientes.length} pacientes encontrados</p>
        </div>
        <Link
          href="/app/pacientes/nuevo"
          className="brand-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={16} /> Nuevo paciente
        </Link>
      </div>

      <form className="mt-6 flex max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
        <Search size={16} className="text-slate-400" />
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre o documento..."
          className="w-full text-sm outline-none"
        />
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Paciente</th>
              <th className="px-5 py-3">Documento</th>
              <th className="px-5 py-3">EPS / Régimen</th>
              <th className="px-5 py-3">Registrado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {pacientes.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-5 py-3">
                  <Link href={`/app/pacientes/${p.id}`} className="font-semibold text-[var(--brand-primary)]">
                    {p.primerNombre} {p.segundoNombre} {p.primerApellido} {p.segundoApellido}
                  </Link>
                </td>
                <td className="px-5 py-3 text-slate-600">
                  {p.tipoDocumento} {p.numeroDocumento}
                </td>
                <td className="px-5 py-3 text-slate-600">{p.eps ?? p.regimenAfiliacion}</td>
                <td className="px-5 py-3 text-slate-500">{formatFechaCorta(p.createdAt)}</td>
              </tr>
            ))}
            {pacientes.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-slate-400">
                  No hay pacientes registrados todavía.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
