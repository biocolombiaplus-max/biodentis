"use client";

import { useActionState, useState } from "react";
import { Sparkles, Copy } from "lucide-react";
import { pedirAyudaIaAction, type AsistenteState } from "@/lib/ai/actions";

const initialState: AsistenteState = {};

export function AsistenteIA() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(pedirAyudaIaAction, initialState);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-[var(--brand-primary)]/30 bg-[var(--brand-mist)] px-4 py-2.5 text-sm font-semibold text-[var(--brand-primary)]"
      >
        <Sparkles size={16} /> Pedir ayuda al asistente de IA
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--brand-primary)]/20 bg-[var(--brand-mist)] p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--brand-primary-dark)]">
        <Sparkles size={16} /> Asistente de IA
      </div>

      <div className="space-y-3">
        <textarea
          form="asistente-ia-form"
          name="notas"
          rows={3}
          placeholder="Escribe notas breves, ej: dolor molar inferior derecho, sensible al frío hace 3 días..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <form id="asistente-ia-form" action={formAction} className="flex flex-wrap gap-2">
          <button
            type="submit"
            name="tipo"
            value="diagnostico"
            disabled={pending}
            className="rounded-lg bg-[var(--brand-accent)] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
          >
            Sugerir diagnóstico CIE-10
          </button>
          <button
            type="submit"
            name="tipo"
            value="evolucion"
            disabled={pending}
            className="rounded-lg border border-[var(--brand-accent)] px-3 py-2 text-xs font-semibold text-[var(--brand-accent)] disabled:opacity-60"
          >
            Redactar evolución
          </button>
        </form>

        {pending ? <p className="text-xs text-slate-500">Pensando...</p> : null}
        {state.error ? <p className="text-xs text-red-600">{state.error}</p> : null}
        {state.resultado ? (
          <div className="rounded-lg border border-white bg-white p-3 text-sm text-slate-700">
            <p className="whitespace-pre-line">{state.resultado}</p>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(state.resultado ?? "")}
              className="mt-2 flex items-center gap-1 text-xs font-semibold text-[var(--brand-primary)]"
            >
              <Copy size={12} /> Copiar y pegar en el campo correspondiente
            </button>
          </div>
        ) : null}

        <p className="text-[11px] text-slate-400">
          Las sugerencias de la IA son un apoyo y deben ser revisadas por el profesional responsable.
        </p>
      </div>
    </div>
  );
}
