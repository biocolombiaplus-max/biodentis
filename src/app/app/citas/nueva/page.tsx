"use client";

import { useActionState, useEffect, useState } from "react";
import { crearCitaAction, type FormState } from "@/lib/citas/actions";

const initialState: FormState = {};

type PacienteOpcion = { id: string; nombre: string };

export default function NuevaCitaPage() {
  const [state, formAction, pending] = useActionState(crearCitaAction, initialState);
  const [pacientes, setPacientes] = useState<PacienteOpcion[]>([]);

  useEffect(() => {
    fetch("/api/pacientes/opciones")
      .then((r) => r.json())
      .then(setPacientes)
      .catch(() => setPacientes([]));
  }, []);

  const input = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20";
  const label = "mb-1 block text-sm font-medium text-slate-700";

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--brand-accent)]">Nueva cita</h1>
      <form action={formAction} className="mt-6 max-w-lg space-y-4 rounded-2xl border border-black/5 bg-white p-6">
        <label>
          <span className={label}>Paciente</span>
          <select name="pacienteId" required className={input} defaultValue="">
            <option value="" disabled>
              Selecciona un paciente
            </option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className={label}>Fecha y hora</span>
          <input type="datetime-local" name="fechaHora" required className={input} />
        </label>
        <label>
          <span className={label}>Duración (minutos)</span>
          <input type="number" name="duracionMin" defaultValue={30} className={input} />
        </label>
        <label>
          <span className={label}>Motivo</span>
          <input name="motivo" className={input} placeholder="Ej: Control, obturación, urgencia..." />
        </label>

        {state.error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p> : null}

        <button
          type="submit"
          disabled={pending}
          className="brand-gradient rounded-xl px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Agendando..." : "Agendar cita"}
        </button>
      </form>
    </div>
  );
}
