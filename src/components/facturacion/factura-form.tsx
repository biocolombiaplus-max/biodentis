"use client";

import { useActionState, useMemo, useState } from "react";
import { crearFacturaAction, type FormState } from "@/lib/facturacion/actions";
import { formatCOP } from "@/lib/format";
import type { Procedimiento } from "@prisma/client";

const initialState: FormState = {};

type ItemExtra = { descripcion: string; valorUnitario: string };

export function FacturaForm({ pacienteId, procedimientos }: { pacienteId: string; procedimientos: Procedimiento[] }) {
  const [state, formAction, pending] = useActionState(crearFacturaAction, initialState);
  const [seleccion, setSeleccion] = useState<Record<string, number>>({});
  const [extras, setExtras] = useState<ItemExtra[]>([]);
  const [descuento, setDescuento] = useState(0);

  const items = useMemo(() => {
    const deCatalogo = procedimientos
      .filter((p) => (seleccion[p.id] ?? 0) > 0)
      .map((p) => ({ descripcion: p.nombre, cups: p.codigoCups, cantidad: seleccion[p.id], valorUnitario: p.valor }));
    const deExtras = extras
      .filter((e) => e.descripcion && Number(e.valorUnitario) > 0)
      .map((e) => ({ descripcion: e.descripcion, cantidad: 1, valorUnitario: Number(e.valorUnitario) }));
    return [...deCatalogo, ...deExtras];
  }, [seleccion, extras, procedimientos]);

  const subtotal = items.reduce((acc, i) => acc + i.cantidad * i.valorUnitario, 0);
  const total = Math.max(subtotal - descuento, 0);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="pacienteId" value={pacienteId} />
      <input type="hidden" name="itemsJson" value={JSON.stringify(items)} />

      <section className="rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-bold text-[var(--brand-accent)]">Procedimientos del consultorio</h2>
        <div className="mt-4 space-y-2">
          {procedimientos.map((p) => (
            <label key={p.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2.5">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={(seleccion[p.id] ?? 0) > 0}
                  onChange={(e) => setSeleccion((s) => ({ ...s, [p.id]: e.target.checked ? 1 : 0 }))}
                />
                <div>
                  <p className="text-sm font-medium text-slate-700">{p.nombre}</p>
                  <p className="text-xs text-slate-400">CUPS {p.codigoCups} · {formatCOP(p.valor)}</p>
                </div>
              </div>
              {(seleccion[p.id] ?? 0) > 0 ? (
                <input
                  type="number"
                  min={1}
                  value={seleccion[p.id]}
                  onChange={(e) => setSeleccion((s) => ({ ...s, [p.id]: Number(e.target.value) || 1 }))}
                  className="w-16 rounded-md border border-slate-200 px-2 py-1 text-sm"
                />
              ) : null}
            </label>
          ))}
          {procedimientos.length === 0 ? (
            <p className="text-sm text-slate-400">No tienes procedimientos configurados en tu catálogo.</p>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-bold text-[var(--brand-accent)]">Otros conceptos</h2>
        <div className="mt-4 space-y-2">
          {extras.map((e, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="Descripción"
                value={e.descripcion}
                onChange={(ev) => setExtras((prev) => prev.map((x, idx) => (idx === i ? { ...x, descripcion: ev.target.value } : x)))}
                className="flex-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-sm"
              />
              <input
                type="number"
                placeholder="Valor"
                value={e.valorUnitario}
                onChange={(ev) => setExtras((prev) => prev.map((x, idx) => (idx === i ? { ...x, valorUnitario: ev.target.value } : x)))}
                className="w-32 rounded-md border border-slate-200 px-2.5 py-1.5 text-sm"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setExtras((prev) => [...prev, { descripcion: "", valorUnitario: "" }])}
            className="text-sm font-semibold text-[var(--brand-primary)]"
          >
            + Agregar concepto
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">Método de pago</span>
            <select name="metodoPago" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta débito/crédito</option>
              <option value="Transferencia">Transferencia</option>
              <option value="PSE">PSE</option>
            </select>
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">Descuento (COP)</span>
            <input
              type="number"
              name="descuento"
              value={descuento}
              onChange={(e) => setDescuento(Number(e.target.value) || 0)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="mt-4 space-y-1 border-t border-black/5 pt-4 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span>{formatCOP(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Descuento</span>
            <span>-{formatCOP(descuento)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-[var(--brand-accent)]">
            <span>Total</span>
            <span>{formatCOP(total)}</span>
          </div>
        </div>
      </section>

      {state.error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending || items.length === 0}
        className="brand-gradient rounded-xl px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Generando..." : "Generar factura"}
      </button>
    </form>
  );
}
