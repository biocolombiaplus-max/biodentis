"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { formatCOP } from "@/lib/format";

type PlanVM = {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  precioMensual: number;
  precioAnual: number | null;
  destacado: boolean;
  caracteristicas: string[];
};

export function PlanesToggle({ planes }: { planes: PlanVM[] }) {
  const [anual, setAnual] = useState(true);

  return (
    <div>
      <div className="mx-auto mb-12 flex w-fit items-center gap-1 rounded-full border border-black/10 bg-white p-1 shadow-sm">
        <button
          onClick={() => setAnual(false)}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            !anual ? "brand-gradient text-white" : "text-slate-500"
          }`}
        >
          Mensual
        </button>
        <button
          onClick={() => setAnual(true)}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            anual ? "brand-gradient text-white" : "text-slate-500"
          }`}
        >
          Anual · 2 meses gratis
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {planes.map((plan) => {
          const esPersonalizado = plan.precioMensual === 0;
          const precioMostrado = anual && plan.precioAnual ? Math.round(plan.precioAnual / 12) : plan.precioMensual;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl border p-7 ${
                plan.destacado
                  ? "border-transparent bg-[var(--brand-ink)] text-white shadow-2xl shadow-fuchsia-900/30 lg:-translate-y-3"
                  : "border-black/10 bg-white"
              }`}
            >
              {plan.destacado ? (
                <span className="brand-gradient absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full px-4 py-1 text-xs font-bold text-white shadow-lg">
                  <Sparkles size={13} /> Recomendado
                </span>
              ) : null}

              <h3 className={`text-lg font-bold ${plan.destacado ? "text-white" : "text-[var(--brand-accent)]"}`}>
                {plan.nombre}
              </h3>
              <p className={`mt-1.5 text-sm ${plan.destacado ? "text-white/60" : "text-slate-500"}`}>
                {plan.descripcion}
              </p>

              <div className="mt-6">
                {esPersonalizado ? (
                  <p className={`text-3xl font-extrabold ${plan.destacado ? "text-white" : "text-[var(--brand-accent)]"}`}>
                    A la medida
                  </p>
                ) : (
                  <>
                    <span className={`text-4xl font-extrabold ${plan.destacado ? "text-white" : "text-[var(--brand-accent)]"}`}>
                      {formatCOP(precioMostrado)}
                    </span>
                    <span className={`text-sm ${plan.destacado ? "text-white/50" : "text-slate-400"}`}> /mes + IVA</span>
                    {anual ? (
                      <p className={`mt-1 text-xs ${plan.destacado ? "text-white/50" : "text-slate-400"}`}>
                        Facturado anualmente
                      </p>
                    ) : null}
                  </>
                )}
              </div>

              <ul className="mt-7 flex-1 space-y-3">
                {plan.caracteristicas.map((c) => (
                  <li key={c} className="flex items-start gap-2.5 text-sm">
                    <Check
                      size={16}
                      className={`mt-0.5 shrink-0 ${plan.destacado ? "text-[var(--brand-primary-light)]" : "text-[var(--brand-primary)]"}`}
                    />
                    <span className={plan.destacado ? "text-white/80" : "text-slate-600"}>{c}</span>
                  </li>
                ))}
              </ul>

              <ButtonLink
                href="#cta-final"
                variant={plan.destacado ? "primary" : "outline"}
                className={`mt-8 justify-center ${!plan.destacado ? "" : ""}`}
              >
                {esPersonalizado ? "Contáctanos" : "Empezar ahora"}
              </ButtonLink>
            </div>
          );
        })}
      </div>
    </div>
  );
}
