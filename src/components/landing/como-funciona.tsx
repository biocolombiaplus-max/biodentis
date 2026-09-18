import { SectionShell } from "@/components/ui/section-shell";
import { SectionEyebrow } from "@/components/ui/badge";

const PASOS = [
  {
    numero: "01",
    titulo: "Configura tu consultorio",
    texto: "Carga tu logo, colores, información de contacto y profesionales. Todo desde un panel, sin programador.",
  },
  {
    numero: "02",
    titulo: "Registra tus pacientes",
    texto: "Importa o crea tus pacientes con la información que exige la normativa: documento, EPS, régimen y más.",
  },
  {
    numero: "03",
    titulo: "Atiende con la IA guiándote",
    texto: "Registra la historia clínica y el odontograma mientras el asistente te sugiere codificación y evolución.",
  },
  {
    numero: "04",
    titulo: "Factura y reporta sin esfuerzo",
    texto: "Genera la factura del procedimiento y deja que el sistema arme tus archivos RIPS del periodo.",
  },
];

export function ComoFunciona({
  titulo,
  subtitulo,
  backgroundImageUrl,
}: {
  titulo: string;
  subtitulo?: string | null;
  backgroundImageUrl?: string | null;
}) {
  return (
    <SectionShell tone="mist" backgroundImageUrl={backgroundImageUrl}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Puesta en marcha</SectionEyebrow>
          <h2 className="text-3xl font-extrabold text-[var(--brand-accent)] sm:text-4xl">{titulo}</h2>
          {subtitulo ? <p className="mt-4 text-slate-600">{subtitulo}</p> : null}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PASOS.map((p) => (
            <div key={p.numero} className="relative rounded-2xl bg-white p-6 shadow-sm">
              <span className="brand-gradient-text text-4xl font-black">{p.numero}</span>
              <h3 className="mt-3 font-bold text-[var(--brand-accent)]">{p.titulo}</h3>
              <p className="mt-2 text-sm text-slate-600">{p.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
