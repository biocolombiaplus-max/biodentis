import { SectionShell } from "@/components/ui/section-shell";
import { SectionEyebrow } from "@/components/ui/badge";
import { PlanesToggle } from "@/components/landing/planes-toggle";
import type { Plan } from "@prisma/client";

export function PlanesSection({
  titulo,
  subtitulo,
  planes,
  backgroundImageUrl,
}: {
  titulo: string;
  subtitulo?: string | null;
  planes: Plan[];
  backgroundImageUrl?: string | null;
}) {
  const planesVM = planes.map((p) => ({
    id: p.id,
    codigo: p.codigo,
    nombre: p.nombre,
    descripcion: p.descripcion,
    precioMensual: p.precioMensual,
    precioAnual: p.precioAnual,
    destacado: p.destacado,
    caracteristicas: JSON.parse(p.caracteristicas) as string[],
  }));

  return (
    <SectionShell id="planes" tone="mist" backgroundImageUrl={backgroundImageUrl}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Planes en pesos colombianos</SectionEyebrow>
          <h2 className="text-3xl font-extrabold text-[var(--brand-accent)] sm:text-4xl">{titulo}</h2>
          {subtitulo ? <p className="mt-4 text-slate-600">{subtitulo}</p> : null}
        </div>

        <div className="mt-14">
          <PlanesToggle planes={planesVM} />
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Todos los planes incluyen 14 días de prueba gratis. Sin tarjeta de crédito.
        </p>
      </div>
    </SectionShell>
  );
}
