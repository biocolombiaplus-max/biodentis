"use client";

import { useId, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

type Column = { key: string; label: string; placeholder?: string; list?: string[] };

export function DynamicList({
  name,
  columns,
  defaultValue,
  addLabel = "Agregar fila",
}: {
  name: string;
  columns: Column[];
  defaultValue?: Record<string, string>[];
  addLabel?: string;
}) {
  const [rows, setRows] = useState<Record<string, string>[]>(defaultValue ?? []);
  const baseId = useId();

  function actualizar(i: number, key: string, value: string) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));
  }

  function agregar() {
    setRows((prev) => [...prev, Object.fromEntries(columns.map((c) => [c.key, ""]))]);
  }

  function quitar(i: number) {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(rows)} />
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 p-2.5">
            {columns.map((col) => (
              <input
                key={col.key}
                list={col.list ? `${baseId}-${col.key}` : undefined}
                value={row[col.key] ?? ""}
                onChange={(e) => actualizar(i, col.key, e.target.value)}
                placeholder={col.placeholder ?? col.label}
                className="min-w-[120px] flex-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-sm"
              />
            ))}
            <button type="button" onClick={() => quitar(i)} className="text-slate-400 hover:text-red-500">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      {columns.map((col) =>
        col.list ? (
          <datalist key={col.key} id={`${baseId}-${col.key}`}>
            {col.list.map((v) => (
              <option key={v} value={v} />
            ))}
          </datalist>
        ) : null
      )}
      <button
        type="button"
        onClick={agregar}
        className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-primary)]"
      >
        <Plus size={15} /> {addLabel}
      </button>
    </div>
  );
}
