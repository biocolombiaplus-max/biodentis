"use client";

import { useActionState, useState } from "react";
import { crearConsentimientoAction, type FormState } from "@/lib/consentimientos/actions";
import type { PlantillaConsentimiento } from "@prisma/client";

const initialState: FormState = {};

export function NuevoConsentimientoForm({
  pacienteId,
  plantillas,
}: {
  pacienteId: string;
  plantillas: PlantillaConsentimiento[];
}) {
  const [state, formAction, pending] = useActionState(crearConsentimientoAction, initialState);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");

  function elegirPlantilla(id: string) {
    const plantilla = plantillas.find((p) => p.id === id);
    if (plantilla) {
      setTitulo(plantilla.nombre);
      setContenido(plantilla.contenido);
    }
  }

  const input = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20";
  const label = "mb-1 block text-sm font-medium text-slate-700";

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="pacienteId" value={pacienteId} />

      {plantillas.length > 0 ? (
        <label>
          <span className={label}>Usar una plantilla</span>
          <select
            name="plantillaId"
            className={input}
            onChange={(e) => elegirPlantilla(e.target.value)}
            defaultValue=""
          >
            <option value="">Escribir manualmente</option>
            {plantillas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label>
        <span className={label}>Título del consentimiento</span>
        <input
          name="titulo"
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className={input}
          placeholder="Ej: Consentimiento para exodoncia"
        />
      </label>

      <label>
        <span className={label}>Contenido</span>
        <textarea
          name="contenido"
          required
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          rows={10}
          className={input}
        />
      </label>

      {state.error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="brand-gradient rounded-xl px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Creando..." : "Crear consentimiento"}
      </button>
    </form>
  );
}
