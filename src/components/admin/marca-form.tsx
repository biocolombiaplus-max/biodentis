"use client";

import { useActionState } from "react";
import { updateMarcaAction, type FormState } from "@/lib/admin/actions";
import type { Clinica } from "@prisma/client";

const initialState: FormState = {};

function Field({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20"
      />
    </label>
  );
}

function ColorField({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2">
        <input type="color" name={name} defaultValue={defaultValue} className="h-8 w-10 cursor-pointer" />
        <span className="text-sm text-slate-500">{defaultValue}</span>
      </div>
    </label>
  );
}

export function MarcaForm({ clinica }: { clinica: Clinica }) {
  const [state, formAction, pending] = useActionState(updateMarcaAction, initialState);

  return (
    <form action={formAction} className="space-y-8">
      <section className="rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-bold text-[var(--brand-accent)]">Información del consultorio</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nombre del consultorio" name="nombre" defaultValue={clinica.nombre} />
          <Field label="NIT" name="nit" defaultValue={clinica.nit} />
          <Field label="Eslogan" name="slogan" defaultValue={clinica.slogan} />
          <Field label="Ciudad" name="ciudad" defaultValue={clinica.ciudad} />
          <Field label="Dirección" name="direccion" defaultValue={clinica.direccion} />
          <Field label="Teléfono" name="telefono" defaultValue={clinica.telefono} />
          <Field label="WhatsApp (con indicativo, solo números)" name="whatsapp" defaultValue={clinica.whatsapp} />
          <Field label="Correo de contacto" name="email" defaultValue={clinica.email} type="email" />
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-bold text-[var(--brand-accent)]">Logo y favicon</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Logo (PNG, JPG, WEBP o SVG)</span>
            <input type="file" name="logo" accept="image/*" className="block w-full text-sm" />
            {clinica.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={clinica.logoUrl} alt="Logo actual" className="mt-2 h-10 object-contain" />
            ) : null}
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Favicon</span>
            <input type="file" name="favicon" accept="image/*" className="block w-full text-sm" />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-bold text-[var(--brand-accent)]">Colores de marca</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ColorField label="Color primario" name="colorPrimario" defaultValue={clinica.colorPrimario} />
          <ColorField label="Color secundario" name="colorSecundario" defaultValue={clinica.colorSecundario} />
          <ColorField label="Color de acento / oscuro" name="colorAcento" defaultValue={clinica.colorAcento} />
        </div>
      </section>

      {state.error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p> : null}
      {state.ok ? <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-600">Cambios guardados.</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="brand-gradient rounded-xl px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
