"use client";

import { useActionState } from "react";
import { updateSeccionAction, type FormState } from "@/lib/admin/actions";
import type { SeccionLanding } from "@prisma/client";

const initialState: FormState = {};

const NOMBRES: Record<string, string> = {
  hero: "Portada (Hero)",
  confianza: "Cumplimiento normativo",
  beneficios: "Beneficios",
  como_funciona: "Cómo funciona",
  ia: "Inteligencia artificial",
  personalizacion: "Personalización",
  planes: "Planes",
  testimonios: "Testimonios",
  faq: "Preguntas frecuentes",
  cta_final: "Llamado a la acción final",
};

export function SeccionCard({ seccion }: { seccion: SeccionLanding }) {
  const [state, formAction, pending] = useActionState(updateSeccionAction, initialState);

  return (
    <form action={formAction} className="rounded-2xl border border-black/5 bg-white p-6">
      <input type="hidden" name="id" value={seccion.id} />
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[var(--brand-accent)]">{NOMBRES[seccion.clave] ?? seccion.clave}</h3>
        <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <input type="checkbox" name="visible" defaultChecked={seccion.visible} />
          Visible en la página
        </label>
      </div>

      <div className="mt-4 space-y-3">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Título</span>
          <input
            name="titulo"
            defaultValue={seccion.titulo ?? ""}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Subtítulo</span>
          <textarea
            name="subtitulo"
            defaultValue={seccion.subtitulo ?? ""}
            rows={2}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20"
          />
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Imagen de fondo</span>
            <input type="file" name="imagenFondo" accept="image/*" className="block w-full text-sm" />
          </label>
          {seccion.imagenFondoUrl ? (
            <label className="flex items-end gap-2 text-xs text-slate-500">
              <input type="checkbox" name="quitarImagen" /> Quitar imagen actual
            </label>
          ) : null}
        </div>
        {seccion.imagenFondoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={seccion.imagenFondoUrl} alt="" className="h-24 w-full rounded-lg object-cover" />
        ) : null}
      </div>

      {state.error ? <p className="mt-3 text-sm text-red-600">{state.error}</p> : null}
      {state.ok ? <p className="mt-3 text-sm text-emerald-600">Guardado.</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-lg bg-[var(--brand-accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Guardando..." : "Guardar sección"}
      </button>
    </form>
  );
}
