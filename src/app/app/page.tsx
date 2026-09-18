import Link from "next/link";
import { Users, CalendarClock, PenTool, FileBarChart } from "lucide-react";
import { requireSession } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { formatFechaCorta } from "@/lib/format";

export default async function DashboardPage() {
  const session = await requireSession();

  const inicioHoy = new Date();
  inicioHoy.setHours(0, 0, 0, 0);
  const finHoy = new Date(inicioHoy);
  finHoy.setDate(finHoy.getDate() + 1);

  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  const [totalPacientes, citasHoy, historiasMes, consentimientosPendientes, proximasCitas] = await Promise.all([
    prisma.paciente.count({ where: { clinicaId: session.clinicaId } }),
    prisma.cita.count({ where: { clinicaId: session.clinicaId, fechaHora: { gte: inicioHoy, lt: finHoy } } }),
    prisma.historiaClinica.count({ where: { clinicaId: session.clinicaId, createdAt: { gte: inicioMes } } }),
    prisma.consentimientoInformado.count({
      where: { paciente: { clinicaId: session.clinicaId }, estado: { in: ["PENDIENTE", "ENVIADO"] } },
    }),
    prisma.cita.findMany({
      where: { clinicaId: session.clinicaId, fechaHora: { gte: inicioHoy } },
      include: { paciente: true, profesional: true },
      orderBy: { fechaHora: "asc" },
      take: 5,
    }),
  ]);

  const kpis = [
    { label: "Pacientes activos", value: totalPacientes, icon: Users, href: "/app/pacientes" },
    { label: "Citas de hoy", value: citasHoy, icon: CalendarClock, href: "/app/citas" },
    { label: "Historias este mes", value: historiasMes, icon: PenTool, href: "/app/historias" },
    { label: "Consentimientos pendientes", value: consentimientosPendientes, icon: FileBarChart, href: "/app/consentimientos" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--brand-accent)]">Hola, {session.nombre.split(" ")[0]}</h1>
      <p className="mt-1 text-sm text-slate-500">Este es el resumen de tu consultorio hoy.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Link
            key={kpi.label}
            href={kpi.href}
            className="rounded-2xl border border-black/5 bg-white p-5 transition hover:border-[var(--brand-primary)]/30 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-mist)] text-[var(--brand-primary)]">
                <kpi.icon size={18} />
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-[var(--brand-accent)]">{kpi.value}</p>
            <p className="mt-1 text-sm text-slate-500">{kpi.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[var(--brand-accent)]">Próximas citas</h2>
          <Link href="/app/citas" className="text-sm font-semibold text-[var(--brand-primary)]">
            Ver agenda →
          </Link>
        </div>

        {proximasCitas.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No tienes citas próximas registradas.</p>
        ) : (
          <div className="mt-4 divide-y divide-black/5">
            {proximasCitas.map((cita) => (
              <div key={cita.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--brand-accent)]">
                    {cita.paciente.primerNombre} {cita.paciente.primerApellido}
                  </p>
                  <p className="text-xs text-slate-500">
                    con {cita.profesional.nombre} · {cita.motivo ?? "Consulta"}
                  </p>
                </div>
                <span className="text-sm text-slate-500">
                  {formatFechaCorta(cita.fechaHora)} · {cita.fechaHora.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
