import { Quote } from "lucide-react";
import { SectionShell } from "@/components/ui/section-shell";
import { SectionEyebrow } from "@/components/ui/badge";
import type { Testimonio } from "@prisma/client";

export function TestimoniosSection({
  titulo,
  testimonios,
  backgroundImageUrl,
}: {
  titulo: string;
  testimonios: Testimonio[];
  backgroundImageUrl?: string | null;
}) {
  if (testimonios.length === 0) return null;

  return (
    <SectionShell tone="light" backgroundImageUrl={backgroundImageUrl}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Testimonios</SectionEyebrow>
          <h2 className="text-3xl font-extrabold text-[var(--brand-accent)] sm:text-4xl">{titulo}</h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonios.map((t) => (
            <figure key={t.id} className="rounded-2xl border border-black/5 bg-[var(--brand-mist)] p-6">
              <Quote className="text-[var(--brand-primary)]/40" size={28} />
              <blockquote className="mt-3 text-sm text-slate-700">“{t.texto}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full brand-gradient text-xs font-bold text-white">
                  {t.nombre.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--brand-accent)]">{t.nombre}</p>
                  {t.cargo ? <p className="text-xs text-slate-500">{t.cargo}</p> : null}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
