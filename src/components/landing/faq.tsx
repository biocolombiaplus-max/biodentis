"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionShell } from "@/components/ui/section-shell";
import { SectionEyebrow } from "@/components/ui/badge";

const PREGUNTAS = [
  {
    q: "¿BioDentis cumple con la normativa colombiana de historia clínica?",
    a: "Sí. La historia clínica está estructurada según los contenidos mínimos de la Resolución 3100 de 2019 y se conserva de forma segura e inmodificable una vez firmada, como exige la normativa.",
  },
  {
    q: "¿Puedo generar los archivos RIPS desde el sistema?",
    a: "Sí. A partir de las atenciones, consultas y procedimientos registrados, BioDentis genera los archivos RIPS del periodo listos para tu proceso de facturación y reporte.",
  },
  {
    q: "¿Cómo firman los pacientes el consentimiento informado?",
    a: "El paciente puede firmar con el dedo directamente en el celular o la tablet del consultorio, o recibir un enlace seguro por WhatsApp o correo para firmar a distancia antes de su cita.",
  },
  {
    q: "¿Puedo personalizar el logo, los colores y las imágenes?",
    a: "Sí, todo se configura desde el panel de administración: logo, colores de marca, textos e imágenes de fondo de cada sección de tu página, sin necesidad de un programador.",
  },
  {
    q: "¿Qué pasa con la información de mis pacientes si cancelo?",
    a: "Puedes exportar toda tu información (pacientes, historias clínicas y RIPS) en cualquier momento. Nunca quedas atado a la plataforma.",
  },
  {
    q: "¿Necesito instalar algo en mi computador?",
    a: "No. BioDentis funciona desde el navegador, en computador, tablet o celular, sin instalaciones ni servidores propios.",
  },
];

export function Faq({ titulo }: { titulo: string }) {
  const [abierto, setAbierto] = useState<number | null>(0);

  return (
    <SectionShell id="faq" tone="light">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="text-center">
          <SectionEyebrow>Resolvemos tus dudas</SectionEyebrow>
          <h2 className="text-3xl font-extrabold text-[var(--brand-accent)] sm:text-4xl">{titulo}</h2>
        </div>

        <div className="mt-10 space-y-3">
          {PREGUNTAS.map((item, i) => {
            const isOpen = abierto === i;
            return (
              <div key={item.q} className="overflow-hidden rounded-2xl border border-black/8">
                <button
                  onClick={() => setAbierto(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-semibold text-[var(--brand-accent)]">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[var(--brand-primary)] transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen ? <p className="px-5 pb-4 text-sm text-slate-600">{item.a}</p> : null}
              </div>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
