import Link from "next/link";
import { Sparkles } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="brand-gradient flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2.5 text-center text-sm font-medium text-white">
      <span className="flex items-center gap-1.5">
        <Sparkles size={15} /> Estás en la demo pública de BioDentis — puedes navegar todo, pero nada se guarda.
      </span>
      <Link href="/#planes" className="underline decoration-white/60 underline-offset-2 hover:decoration-white">
        Quiero esto para mi consultorio →
      </Link>
    </div>
  );
}
