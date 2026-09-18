import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, PenTool, Receipt, Pencil } from "lucide-react";
import { requireSession } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { formatFechaCorta, formatCOP, calcularEdad } from "@/lib/format";

export default async function PacienteDetallePage({ params }: PageProps<"/app/pacientes/[id]">) {
  const session = await requireSession();
  const { id } = await params;

  const paciente = await prisma.paciente.findUnique({
    where: { id },
    include: {
      historias: { orderBy: { fechaAtencion: "desc" }, include: { profesional: true } },
      consentimientos: { orderBy: { createdAt: "desc" } },
      facturas: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!paciente || paciente.clinicaId !== session.clinicaId) notFound();

  const edad = calcularEdad(paciente.fechaNacimiento);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--brand-accent)]">
            {paciente.primerNombre} {paciente.segundoNombre} {paciente.primerApellido} {paciente.segundoApellido}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {paciente.tipoDocumento} {paciente.numeroDocumento} · {edad} años · {paciente.eps ?? paciente.regimenAfiliacion}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/app/pacientes/${paciente.id}/editar`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
          >
            <Pencil size={15} /> Editar
          </Link>
          <Link
            href={`/app/historias/nueva?pacienteId=${paciente.id}`}
            className="brand-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white"
          >
            <FileText size={15} /> Nueva historia clínica
          </Link>
        </div>
      </div>

      {!paciente.habeasDataAceptado ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Este paciente no tiene registrada la autorización de tratamiento de datos (Habeas Data). Actualízala antes de
          continuar con la atención.
        </div>
      ) : null}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-2xl border border-black/5 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[var(--brand-accent)]">Historias clínicas</h2>
              <span className="text-xs text-slate-400">{paciente.historias.length}</span>
            </div>
            {paciente.historias.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">Sin historias clínicas registradas.</p>
            ) : (
              <ul className="mt-3 divide-y divide-black/5">
                {paciente.historias.map((h) => (
                  <li key={h.id} className="py-3">
                    <Link href={`/app/historias/${h.id}`} className="font-medium text-[var(--brand-primary)]">
                      {formatFechaCorta(h.fechaAtencion)} · {h.motivoConsulta}
                    </Link>
                    <p className="text-xs text-slate-500">Atendió: {h.profesional.nombre}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[var(--brand-accent)]">Consentimientos informados</h2>
              <Link href={`/app/consentimientos/nuevo?pacienteId=${paciente.id}`} className="text-xs font-semibold text-[var(--brand-primary)]">
                + Nuevo
              </Link>
            </div>
            {paciente.consentimientos.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">Sin consentimientos registrados.</p>
            ) : (
              <ul className="mt-3 divide-y divide-black/5">
                {paciente.consentimientos.map((c) => (
                  <li key={c.id} className="flex items-center justify-between py-3">
                    <Link href={`/app/consentimientos/${c.id}`} className="font-medium text-[var(--brand-primary)]">
                      {c.titulo}
                    </Link>
                    <EstadoBadge estado={c.estado} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-6">
            <h2 className="font-bold text-[var(--brand-accent)]">Facturas</h2>
            {paciente.facturas.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">Sin facturas registradas.</p>
            ) : (
              <ul className="mt-3 divide-y divide-black/5">
                {paciente.facturas.map((f) => (
                  <li key={f.id} className="flex items-center justify-between py-3">
                    <span className="font-medium text-[var(--brand-accent)]">Factura #{f.numero}</span>
                    <span className="text-sm text-slate-600">{formatCOP(f.total)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-black/5 bg-white p-6">
            <h2 className="font-bold text-[var(--brand-accent)]">Contacto</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <Row label="Celular" value={paciente.celular} />
              <Row label="Teléfono" value={paciente.telefono} />
              <Row label="Correo" value={paciente.email} />
              <Row label="Dirección" value={paciente.direccion} />
              <Row label="Municipio" value={[paciente.municipio, paciente.departamento].filter(Boolean).join(", ")} />
            </dl>
          </section>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/app/consentimientos/nuevo?pacienteId=${paciente.id}`}
              className="flex flex-col items-center gap-2 rounded-xl border border-black/5 bg-white p-4 text-center text-xs font-semibold text-slate-600 hover:border-[var(--brand-primary)]/30"
            >
              <PenTool size={18} className="text-[var(--brand-primary)]" /> Consentimiento
            </Link>
            <Link
              href={`/app/facturacion/nueva?pacienteId=${paciente.id}`}
              className="flex flex-col items-center gap-2 rounded-xl border border-black/5 bg-white p-4 text-center text-xs font-semibold text-slate-600 hover:border-[var(--brand-primary)]/30"
            >
              <Receipt size={18} className="text-[var(--brand-primary)]" /> Facturar
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-slate-400">{label}</dt>
      <dd className="text-right text-slate-700">{value}</dd>
    </div>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  const colors: Record<string, string> = {
    PENDIENTE: "bg-slate-100 text-slate-600",
    ENVIADO: "bg-amber-100 text-amber-700",
    FIRMADO: "bg-emerald-100 text-emerald-700",
    RECHAZADO: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[estado] ?? "bg-slate-100"}`}>
      {estado}
    </span>
  );
}
