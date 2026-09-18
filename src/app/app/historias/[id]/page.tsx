import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { firmarHistoriaAction } from "@/lib/historias/actions";
import { SignaturePad } from "@/components/shared/signature-pad";
import { formatFechaCorta } from "@/lib/format";

type ListaItem = Record<string, string>;

export default async function HistoriaDetallePage({ params }: PageProps<"/app/historias/[id]">) {
  const session = await requireSession();
  const { id } = await params;

  const historia = await prisma.historiaClinica.findUnique({
    where: { id },
    include: { paciente: true, profesional: true },
  });
  if (!historia || historia.clinicaId !== session.clinicaId) notFound();

  const diagnosticos: ListaItem[] = historia.diagnosticosJson ? JSON.parse(historia.diagnosticosJson) : [];
  const plan: ListaItem[] = historia.planTratamientoJson ? JSON.parse(historia.planTratamientoJson) : [];
  const procedimientos: ListaItem[] = historia.procedimientosRealizadosJson ? JSON.parse(historia.procedimientosRealizadosJson) : [];
  const odontograma: Record<string, string> = historia.odontogramaJson ? JSON.parse(historia.odontogramaJson) : {};

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--brand-accent)]">
            Historia clínica · {historia.paciente.primerNombre} {historia.paciente.primerApellido}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {formatFechaCorta(historia.fechaAtencion)} · Atendió {historia.profesional.nombre}
          </p>
        </div>
        {historia.bloqueada ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Firmada el {historia.firmadaEn ? formatFechaCorta(historia.firmadaEn) : ""}
          </span>
        ) : (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Borrador</span>
        )}
      </div>

      <div className="mt-6 space-y-5">
        <Bloque titulo="Motivo de consulta">{historia.motivoConsulta}</Bloque>
        {historia.enfermedadActual ? <Bloque titulo="Enfermedad actual">{historia.enfermedadActual}</Bloque> : null}
        {historia.antecedentesPersonales ? (
          <Bloque titulo="Antecedentes personales">{historia.antecedentesPersonales}</Bloque>
        ) : null}
        {historia.examenIntraoral ? <Bloque titulo="Examen intraoral">{historia.examenIntraoral}</Bloque> : null}

        {Object.keys(odontograma).length > 0 ? (
          <section className="rounded-2xl border border-black/5 bg-white p-6">
            <h2 className="font-bold text-[var(--brand-accent)]">Odontograma</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(odontograma).map(([diente, estado]) => (
                <span key={diente} className="rounded-lg bg-[var(--brand-mist)] px-2.5 py-1 text-xs font-semibold text-[var(--brand-primary-dark)]">
                  {diente}: {estado}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {diagnosticos.length > 0 ? (
          <TablaBloque titulo="Diagnósticos" items={diagnosticos} columnas={["codigo", "diente"]} />
        ) : null}
        {plan.length > 0 ? (
          <TablaBloque titulo="Plan de tratamiento" items={plan} columnas={["procedimiento", "diente", "prioridad"]} />
        ) : null}
        {procedimientos.length > 0 ? (
          <TablaBloque titulo="Procedimientos realizados" items={procedimientos} columnas={["cups", "diente", "valor"]} />
        ) : null}

        {historia.recomendaciones ? <Bloque titulo="Recomendaciones">{historia.recomendaciones}</Bloque> : null}

        <section className="rounded-2xl border border-black/5 bg-white p-6">
          <h2 className="font-bold text-[var(--brand-accent)]">Firma del profesional</h2>
          {historia.bloqueada && historia.firmaProfesionalUrl ? (
            <div className="mt-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={historia.firmaProfesionalUrl} alt="Firma" className="h-28 rounded-lg border border-slate-200 bg-white" />
              <p className="mt-2 text-xs text-slate-500">
                Historia clínica firmada e inmodificable, conforme a la Resolución 3100 de 2019.
              </p>
            </div>
          ) : (
            <form action={firmarHistoriaAction} className="mt-4 space-y-3">
              <input type="hidden" name="id" value={historia.id} />
              <SignaturePad name="firmaProfesionalUrl" label="Firma" />
              <button
                type="submit"
                className="brand-gradient rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
              >
                Firmar y bloquear historia
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-black/5 bg-white p-6">
      <h2 className="font-bold text-[var(--brand-accent)]">{titulo}</h2>
      <p className="mt-2 whitespace-pre-line text-sm text-slate-600">{children}</p>
    </section>
  );
}

function TablaBloque({ titulo, items, columnas }: { titulo: string; items: ListaItem[]; columnas: string[] }) {
  return (
    <section className="rounded-2xl border border-black/5 bg-white p-6">
      <h2 className="font-bold text-[var(--brand-accent)]">{titulo}</h2>
      <div className="mt-3 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex flex-wrap gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
            {columnas.map((c) => (item[c] ? <span key={c}>{item[c]}</span> : null))}
          </div>
        ))}
      </div>
    </section>
  );
}
