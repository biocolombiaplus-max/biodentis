"use client";

import { useState } from "react";

const FILA_SUPERIOR = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const FILA_INFERIOR = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

const ESTADOS = ["sano", "caries", "obturado", "ausente", "corona", "endodoncia", "extraer"] as const;
type Estado = (typeof ESTADOS)[number];

const ESTADO_STYLE: Record<Estado, string> = {
  sano: "bg-white border-slate-300 text-slate-500",
  caries: "bg-red-100 border-red-400 text-red-700",
  obturado: "bg-blue-100 border-blue-400 text-blue-700",
  ausente: "bg-slate-200 border-slate-400 text-slate-400 line-through",
  corona: "bg-purple-100 border-purple-400 text-purple-700",
  endodoncia: "bg-amber-100 border-amber-400 text-amber-700",
  extraer: "bg-red-50 border-red-500 text-red-600 border-dashed",
};

const ESTADO_LABEL: Record<Estado, string> = {
  sano: "Sano",
  caries: "Caries",
  obturado: "Obturado",
  ausente: "Ausente",
  corona: "Corona",
  endodoncia: "Endodoncia",
  extraer: "Extracción indicada",
};

export function Odontograma({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: Record<number, Estado>;
}) {
  const [estado, setEstado] = useState<Record<number, Estado>>(defaultValue ?? {});

  function ciclarDiente(numero: number) {
    setEstado((prev) => {
      const actualIdx = ESTADOS.indexOf(prev[numero] ?? "sano");
      const siguiente = ESTADOS[(actualIdx + 1) % ESTADOS.length];
      const next = { ...prev, [numero]: siguiente };
      if (siguiente === "sano") delete next[numero];
      return next;
    });
  }

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(estado)} />
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex min-w-[640px] flex-col items-center gap-1.5">
          <Fila dientes={FILA_SUPERIOR} estado={estado} onClick={ciclarDiente} />
          <div className="my-1 h-px w-full bg-slate-200" />
          <Fila dientes={FILA_INFERIOR} estado={estado} onClick={ciclarDiente} />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        {ESTADOS.filter((e) => e !== "sano").map((e) => (
          <span key={e} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className={`h-3 w-3 rounded border ${ESTADO_STYLE[e]}`} />
            {ESTADO_LABEL[e]}
          </span>
        ))}
      </div>
    </div>
  );
}

function Fila({
  dientes,
  estado,
  onClick,
}: {
  dientes: number[];
  estado: Record<number, Estado>;
  onClick: (n: number) => void;
}) {
  return (
    <div className="flex gap-1.5">
      {dientes.map((numero) => {
        const e = estado[numero] ?? "sano";
        return (
          <button
            type="button"
            key={numero}
            title={ESTADO_LABEL[e]}
            onClick={() => onClick(numero)}
            className={`flex h-10 w-10 flex-col items-center justify-center rounded-md border-2 text-[10px] font-semibold transition ${ESTADO_STYLE[e]}`}
          >
            {numero}
          </button>
        );
      })}
    </div>
  );
}
