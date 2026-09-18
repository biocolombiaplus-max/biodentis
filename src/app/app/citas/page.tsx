import Link from "next/link";
import { requireSession } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { actualizarEstadoCitaAction } from "@/lib/citas/actions";

const ESTADOS: Record<string, string> = {
  PROGRAMADA: "bg-slate-100 text-slate-600",
  CONFIRMADA: "bg-blue-100 text-blue-700",
  ATENDIDA: "bg-emerald-100 text-emerald-700",
  CANCELADA: "bg-red-100 text-red-700",
  NO_ASISTIO: "bg-amber-100 text-amber-700",
};

export default async function CitasPage() {
  const session = await requireSession();

  const inicioHoy = new Date();
  inicioHoy.setHours(0, 0, 0, 0);

  const citas = await prisma.cita.findMany({
    where: { clinicaId: session.clinicaId, fechaHora: { gte: inicioHoy } },
    include: { paciente: true, profesional: true },
    orderBy: { fechaHora: "asc" },
    take: 100,
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--brand-accent)]">Agenda</h1>
        <Link href="/app/citas/nueva" className="brand-gradient rounded-xl px-4 py-2.5 text-sm font-semibold text-white">
          Nueva cita
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {citas.map((cita) => (
          <div key={cita.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/5 bg-white p-4">
            <div>
              <p className="font-semibold text-[var(--brand-accent)]">
                {cita.paciente.primerNombre} {cita.paciente.primerApellido}
              </p>
              <p className="text-xs text-slate-500">
                {cita.fechaHora.toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })} ·{" "}
                {cita.duracionMin} min · {cita.motivo ?? "Consulta"} · {cita.profesional.nombre}
              </p>
            </div>
            <form action={actualizarEstadoCitaAction} className="flex items-center gap-2">
              <input type="hidden" name="id" value={cita.id} />
              <select
                name="estado"
                defaultValue={cita.estado}
                className={`rounded-full border-0 px-3 py-1 text-xs font-semibold ${ESTADOS[cita.estado]}`}
                onChange={(e) => e.currentTarget.form?.requestSubmit()}
              >
                <option value="PROGRAMADA">Programada</option>
                <option value="CONFIRMADA">Confirmada</option>
                <option value="ATENDIDA">Atendida</option>
                <option value="CANCELADA">Cancelada</option>
                <option value="NO_ASISTIO">No asistió</option>
              </select>
            </form>
          </div>
        ))}
        {citas.length === 0 ? (
          <div className="rounded-2xl border border-black/5 bg-white p-10 text-center text-slate-400">
            No tienes citas próximas registradas.
          </div>
        ) : null}
      </div>
    </div>
  );
}
