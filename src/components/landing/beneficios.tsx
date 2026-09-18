import {
  FileText,
  CalendarClock,
  PenTool,
  Receipt,
  FileBarChart,
  Sparkles,
  Building2,
  Users,
} from "lucide-react";
import { SectionShell } from "@/components/ui/section-shell";
import { SectionEyebrow } from "@/components/ui/badge";

const FEATURES = [
  {
    icon: FileText,
    titulo: "Historia clínica digital",
    texto: "Anamnesis, antecedentes, odontograma interactivo, diagnósticos CIE-10 y plan de tratamiento en un solo lugar.",
  },
  {
    icon: CalendarClock,
    titulo: "Agenda inteligente",
    texto: "Citas por profesional o silla, recordatorios automáticos y control de inasistencias.",
  },
  {
    icon: PenTool,
    titulo: "Consentimientos con firma",
    texto: "El paciente firma con el dedo en el celular o tablet del consultorio, o firma a distancia desde un enlace.",
  },
  {
    icon: Receipt,
    titulo: "Facturación electrónica",
    texto: "Genera facturas por procedimiento, controla pagos y mantiene tu contabilidad al día.",
  },
  {
    icon: FileBarChart,
    titulo: "RIPS automáticos",
    texto: "El sistema arma los archivos RIPS del periodo a partir de tus atenciones registradas.",
  },
  {
    icon: Sparkles,
    titulo: "Asistente de inteligencia artificial",
    texto: "Te guía en el registro de la historia clínica, sugiere codificación y redacta evoluciones.",
  },
  {
    icon: Building2,
    titulo: "Multi-sede y multi-sillas",
    texto: "Crece de un consultorio a una clínica con varias sedes sin cambiar de sistema.",
  },
  {
    icon: Users,
    titulo: "Roles y permisos",
    texto: "Define qué puede ver y hacer cada odontólogo, auxiliar o persona de recepción.",
  },
];

export function Beneficios({
  titulo,
  subtitulo,
  backgroundImageUrl,
}: {
  titulo: string;
  subtitulo?: string | null;
  backgroundImageUrl?: string | null;
}) {
  return (
    <SectionShell id="beneficios" tone="light" backgroundImageUrl={backgroundImageUrl}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Un solo sistema</SectionEyebrow>
          <h2 className="text-3xl font-extrabold text-[var(--brand-accent)] sm:text-4xl">{titulo}</h2>
          {subtitulo ? <p className="mt-4 text-slate-600">{subtitulo}</p> : null}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.titulo}
              className="group rounded-2xl border border-black/5 p-6 transition hover:border-[var(--brand-primary)]/30 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-mist)] text-[var(--brand-primary)] transition group-hover:brand-gradient group-hover:text-white">
                <f.icon size={22} />
              </div>
              <h3 className="font-bold text-[var(--brand-accent)]">{f.titulo}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
