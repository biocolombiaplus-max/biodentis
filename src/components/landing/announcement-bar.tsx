import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="brand-gradient relative z-50 py-2 text-center text-xs font-semibold text-white sm:text-sm">
      <Link href="/api/demo" className="inline-flex items-center gap-1.5 px-4 hover:underline">
        🚀 Prueba BioDentis en vivo ahora mismo, sin registro
        <span className="inline-flex items-center gap-1 underline-offset-2">
          Ver demo <ArrowRight size={14} />
        </span>
      </Link>
    </div>
  );
}
