import { ShieldCheck, FileCheck2, Lock, Network } from "lucide-react";
import { SectionShell } from "@/components/ui/section-shell";
import { SectionEyebrow } from "@/components/ui/badge";

const ITEMS = [
  {
    icon: FileCheck2,
    titulo: "Resolución 3100 de 2019",
    texto: "Historia clínica y registros con los estándares mínimos exigidos para la habilitación de servicios de salud odontológicos.",
  },
  {
    icon: ShieldCheck,
    titulo: "RIPS · Resolución 866",
    texto: "Genera los archivos de Registro Individual de Prestación de Servicios de Salud listos para reportar.",
  },
  {
    icon: Lock,
    titulo: "Ley 1581 · Habeas Data",
    texto: "Consentimiento informado y tratamiento de datos personales de tus pacientes, con trazabilidad y respaldo.",
  },
  {
    icon: Network,
    titulo: "Interoperabilidad HL7 FHIR",
    texto: "Preparado para intercambiar historia clínica electrónica con otras IPS y la red nacional de interoperabilidad.",
  },
];

export function Confianza({
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
          <SectionEyebrow>Cumplimiento normativo colombiano</SectionEyebrow>
          <h2 className="text-3xl font-extrabold text-[var(--brand-accent)] sm:text-4xl">{titulo}</h2>
          {subtitulo ? <p className="mt-4 text-slate-600">{subtitulo}</p> : null}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <div
              key={item.titulo}
              className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl brand-gradient text-white">
                <item.icon size={20} />
              </div>
              <h3 className="font-bold text-[var(--brand-accent)]">{item.titulo}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
