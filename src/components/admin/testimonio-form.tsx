"use client";

import { useActionState } from "react";
import { upsertTestimonioAction, eliminarTestimonioAction, type FormState } from "@/lib/admin/actions";
import type { Testimonio } from "@prisma/client";

const initialState: FormState = {};

export function TestimonioForm({ testimonio }: { testimonio?: Testimonio }) {
  const [state, formAction, pending] = useActionState(upsertTestimonioAction, initialState);

  return (
    <form action={formAction} className="rounded-2xl border border-black/5 bg-white p-6">
      {testimonio ? <input type="hidden" name="id" value={testimonio.id} /> : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          name="nombre"
          placeholder="Nombre"
          defaultValue={testimonio?.nombre}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <input
          name="cargo"
          placeholder="Cargo / consultorio"
          defaultValue={testimonio?.cargo ?? ""}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>
      <textarea
        name="texto"
        placeholder="Testimonio"
        defaultValue={testimonio?.texto}
        rows={2}
        className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
      />

      <div className="mt-3 flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <input type="checkbox" name="visible" defaultChecked={testimonio?.visible ?? true} /> Visible
        </label>
        <div className="flex gap-2">
          {testimonio ? (
            <button
              formAction={eliminarTestimonioAction}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              Eliminar
            </button>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-[var(--brand-accent)] px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Guardando..." : testimonio ? "Guardar" : "Agregar testimonio"}
          </button>
        </div>
      </div>
      {state.error ? <p className="mt-2 text-xs text-red-600">{state.error}</p> : null}
    </form>
  );
}
