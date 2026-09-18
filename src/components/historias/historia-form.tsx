"use client";

import { useActionState } from "react";
import { crearHistoriaAction, type FormState } from "@/lib/historias/actions";
import { Odontograma } from "@/components/historias/odontograma";
import { DynamicList } from "@/components/shared/dynamic-list";
import { AsistenteIA } from "@/components/ai/asistente-ia";

const initialState: FormState = {};

const CIE10_SUGERIDOS = [
  "K02.1 Caries de la dentina",
  "K02.9 Caries dental, no especificada",
  "K04.0 Pulpitis",
  "K04.5 Periodontitis apical crónica",
  "K05.0 Gingivitis aguda",
  "K05.1 Gingivitis crónica",
  "K05.3 Periodontitis crónica",
  "K08.1 Pérdida de dientes por accidente, extracción o enfermedad periodontal local",
  "Z01.2 Examen odontológico",
];

const CUPS_SUGERIDOS = [
  "997211 Consulta de primera vez odontología general",
  "997511 Profilaxis y control de placa bacteriana",
  "232135 Obturación resina en diente unirradicular",
  "232541 Exodoncia diente permanente uniradicular",
  "230130 Blanqueamiento dental ambulatorio",
];

export function HistoriaForm({ pacienteId }: { pacienteId: string }) {
  const [state, formAction, pending] = useActionState(crearHistoriaAction, initialState);

  const input = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20";
  const label = "mb-1 block text-sm font-medium text-slate-700";
  const textarea = `${input} min-h-[80px]`;

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="pacienteId" value={pacienteId} />

      <section className="rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-bold text-[var(--brand-accent)]">Motivo de consulta</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label>
            <span className={label}>Finalidad de la consulta</span>
            <select name="finalidadConsulta" className={input} defaultValue="Diagnóstico">
              <option>Diagnóstico</option>
              <option>Tratamiento</option>
              <option>Control</option>
              <option>Urgencia</option>
              <option>Promoción y prevención</option>
            </select>
          </label>
          <label>
            <span className={label}>Causa externa (si aplica)</span>
            <select name="causaExterna" className={input} defaultValue="">
              <option value="">No aplica</option>
              <option>Accidente de trabajo</option>
              <option>Accidente de tránsito</option>
              <option>Accidente rábico</option>
              <option>Otro tipo de accidente</option>
              <option>Evento catastrófico</option>
              <option>Lesión por agresión</option>
              <option>Enfermedad general</option>
            </select>
          </label>
        </div>
        <label className="mt-4 block">
          <span className={label}>Motivo de consulta</span>
          <textarea name="motivoConsulta" required className={textarea} />
        </label>
        <label className="mt-4 block">
          <span className={label}>Enfermedad actual</span>
          <textarea name="enfermedadActual" className={textarea} />
        </label>

        <div className="mt-4">
          <AsistenteIA />
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-bold text-[var(--brand-accent)]">Antecedentes</h2>
        <div className="mt-4 grid grid-cols-1 gap-4">
          <label>
            <span className={label}>Antecedentes personales (médicos, alergias, medicamentos)</span>
            <textarea name="antecedentesPersonales" className={textarea} />
          </label>
          <label>
            <span className={label}>Antecedentes familiares</span>
            <textarea name="antecedentesFamiliares" className={textarea} />
          </label>
          <label>
            <span className={label}>Antecedentes odontológicos</span>
            <textarea name="antecedentesOdontologicos" className={textarea} />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-bold text-[var(--brand-accent)]">Examen clínico</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label>
            <span className={label}>Examen extraoral</span>
            <textarea name="examenExtraoral" className={textarea} />
          </label>
          <label>
            <span className={label}>Examen intraoral</span>
            <textarea name="examenIntraoral" className={textarea} />
          </label>
        </div>

        <div className="mt-5">
          <span className={label}>Odontograma</span>
          <Odontograma name="odontogramaJson" />
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-bold text-[var(--brand-accent)]">Diagnósticos (CIE-10)</h2>
        <div className="mt-4">
          <DynamicList
            name="diagnosticosJson"
            addLabel="Agregar diagnóstico"
            columns={[
              { key: "codigo", label: "Código / descripción CIE-10", list: CIE10_SUGERIDOS, placeholder: "Ej: K02.1 Caries de la dentina" },
              { key: "diente", label: "Diente (FDI)", placeholder: "Ej: 16" },
            ]}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-bold text-[var(--brand-accent)]">Plan de tratamiento</h2>
        <div className="mt-4">
          <DynamicList
            name="planTratamientoJson"
            addLabel="Agregar ítem al plan"
            columns={[
              { key: "procedimiento", label: "Procedimiento (CUPS)", list: CUPS_SUGERIDOS, placeholder: "Ej: 232135 Obturación resina" },
              { key: "diente", label: "Diente", placeholder: "Ej: 16" },
              { key: "prioridad", label: "Prioridad", placeholder: "Alta / media / baja" },
            ]}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-bold text-[var(--brand-accent)]">Procedimientos realizados en esta cita</h2>
        <div className="mt-4">
          <DynamicList
            name="procedimientosRealizadosJson"
            addLabel="Agregar procedimiento realizado"
            columns={[
              { key: "cups", label: "CUPS / descripción", list: CUPS_SUGERIDOS, placeholder: "Ej: 232135 Obturación resina" },
              { key: "diente", label: "Diente", placeholder: "Ej: 16" },
              { key: "valor", label: "Valor (COP)", placeholder: "Ej: 120000" },
            ]}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-bold text-[var(--brand-accent)]">Cierre de la atención</h2>
        <div className="mt-4 grid grid-cols-1 gap-4">
          <label>
            <span className={label}>Observaciones</span>
            <textarea name="observaciones" className={textarea} />
          </label>
          <label>
            <span className={label}>Recomendaciones al paciente</span>
            <textarea name="recomendaciones" className={textarea} />
          </label>
          <label className="max-w-xs">
            <span className={label}>Próximo control</span>
            <input type="date" name="proximoControl" className={input} />
          </label>
        </div>
      </section>

      {state.error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="brand-gradient rounded-xl px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Guardando..." : "Guardar historia clínica"}
      </button>
    </form>
  );
}
