"use client";

import { useActionState } from "react";
import { updatePlanAction, type FormState } from "@/lib/admin/actions";
import type { Plan } from "@prisma/client";

const initialState: FormState = {};

export function PlanCard({ plan }: { plan: Plan }) {
  const [state, formAction, pending] = useActionState(updatePlanAction, initialState);
  const caracteristicas = (JSON.parse(plan.caracteristicas) as string[]).join("\n");

  return (
    <form action={formAction} className="rounded-2xl border border-black/5 bg-white p-6">
      <input type="hidden" name="id" value={plan.id} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-bold text-[var(--brand-accent)]">{plan.nombre}</h3>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="destacado" defaultChecked={plan.destacado} /> Recomendado
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="activo" defaultChecked={plan.activo} /> Activo
          </label>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Nombre del plan</span>
          <input
            name="nombre"
            defaultValue={plan.nombre}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Descripción corta</span>
          <input
            name="descripcion"
            defaultValue={plan.descripcion ?? ""}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Precio mensual (COP)</span>
            <input
              type="number"
              name="precioMensual"
              defaultValue={plan.precioMensual}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Precio anual (COP)</span>
            <input
              type="number"
              name="precioAnual"
              defaultValue={plan.precioAnual ?? ""}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Características (una por línea)</span>
          <textarea
            name="caracteristicas"
            defaultValue={caracteristicas}
            rows={6}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs"
          />
        </label>
      </div>

      {state.error ? <p className="mt-3 text-sm text-red-600">{state.error}</p> : null}
      {state.ok ? <p className="mt-3 text-sm text-emerald-600">Guardado.</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-lg bg-[var(--brand-accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Guardando..." : "Guardar plan"}
      </button>
    </form>
  );
}
