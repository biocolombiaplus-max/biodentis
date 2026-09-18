"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyLinkBox({ link }: { link: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // portapapeles no disponible; el enlace sigue visible para copiar manualmente
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <input readOnly value={link} className="w-full truncate bg-transparent text-xs text-slate-600 outline-none" />
      <button type="button" onClick={copiar} className="shrink-0 text-[var(--brand-primary)]">
        {copiado ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </div>
  );
}
