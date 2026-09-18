"use client";

import { useActionState } from "react";
import { generarRipsAction, type FormState } from "@/lib/rips/actions";

const initialState: FormState = {};

function primerDiaMes() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}
function hoy() {
  return new Date().toISOString().slice(0, 10);
}

export function RipsForm() {
  const [state, formAction, pending] = useActionState(generarRipsAction, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <label>
        <span className="mb-1 block text-xs font-medium text-slate-500">Desde</span>
        <input
          type="date"
          name="periodoInicio"
          defaultValue={primerDiaMes()}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </label>
      <label>
        <span className="mb-1 block text-xs font-medium text-slate-500">Hasta</span>
        <input
          type="date"
          name="periodoFin"
          defaultValue={hoy()}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="brand-gradient rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Generando..." : "Generar RIPS del periodo"}
      </button>
      {state.error ? <p className="w-full text-sm text-red-600">{state.error}</p> : null}
    </form>
  );
}
