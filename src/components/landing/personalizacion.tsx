import { Palette, ImageIcon, Type, Building } from "lucide-react";
import { SectionShell } from "@/components/ui/section-shell";
import { SectionEyebrow } from "@/components/ui/badge";

const ITEMS = [
  { icon: ImageIcon, texto: "Logo y favicon propios" },
  { icon: Palette, texto: "Colores de marca en toda la plataforma" },
  { icon: Type, texto: "Textos de cada sección editables" },
  { icon: Building, texto: "Datos de contacto y sedes" },
];

export function Personalizacion({
  titulo,
  subtitulo,
  backgroundImageUrl,
}: {
  titulo: string;
  subtitulo?: string | null;
  backgroundImageUrl?: string | null;
}) {
  return (
    <SectionShell tone="light" backgroundImageUrl={backgroundImageUrl}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="rounded-2xl border border-black/5 bg-[var(--brand-mist)] p-6">
              <div className="mb-4 flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
                <span className="text-sm font-semibold text-slate-500">Color primario</span>
                <div className="flex gap-2">
                  <span className="h-7 w-7 rounded-full border-2 border-white shadow" style={{ background: "var(--brand-primary)" }} />
                  <span className="h-7 w-7 rounded-full border-2 border-white shadow" style={{ background: "var(--brand-secondary)" }} />
                  <span className="h-7 w-7 rounded-full border-2 border-white shadow" style={{ background: "var(--brand-accent)" }} />
                </div>
              </div>
              <div className="space-y-3">
                {["Logo del consultorio", "Imagen de fondo · Sección Hero", "Imagen de fondo · Planes"].map((row) => (
                  <div key={row} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
                    <span className="text-sm text-slate-600">{row}</span>
                    <span className="rounded-lg bg-[var(--brand-primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--brand-primary)]">
                      Cambiar
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <SectionEyebrow>Cero código</SectionEyebrow>
            <h2 className="text-3xl font-extrabold text-[var(--brand-accent)] sm:text-4xl">{titulo}</h2>
            {subtitulo ? <p className="mt-4 text-slate-600">{subtitulo}</p> : null}

            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {ITEMS.map((item) => (
                <li key={item.texto} className="flex items-center gap-3 rounded-xl border border-black/5 p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-mist)] text-[var(--brand-primary)]">
                    <item.icon size={18} />
                  </span>
                  <span className="text-sm font-medium text-slate-700">{item.texto}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
