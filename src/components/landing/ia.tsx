import type { ReactNode } from "react";
import { Brain, MessageSquareText, ClipboardCheck, Stethoscope } from "lucide-react";
import { SectionShell } from "@/components/ui/section-shell";

const PUNTOS = [
  {
    icon: Stethoscope,
    titulo: "Guía clínica en tiempo real",
    texto: "Te recuerda qué campos exige la Resolución 3100 y sugiere posibles diagnósticos CIE-10 según tus notas.",
  },
  {
    icon: MessageSquareText,
    titulo: "Redacción asistida",
    texto: "Convierte notas rápidas en evoluciones clínicas claras y completas, listas para quedar en la historia.",
  },
  {
    icon: ClipboardCheck,
    titulo: "Checklist administrativo",
    texto: "Verifica que cada atención tenga consentimiento, factura y datos RIPS completos antes de cerrarla.",
  },
];

export function IaSection({
  titulo,
  subtitulo,
  backgroundImageUrl,
}: {
  titulo: string;
  subtitulo?: string | null;
  backgroundImageUrl?: string | null;
}) {
  return (
    <SectionShell id="ia" tone="dark" backgroundImageUrl={backgroundImageUrl}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80">
              <Brain size={14} /> Inteligencia artificial incluida
            </span>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{titulo}</h2>
            {subtitulo ? <p className="mt-4 text-white/60">{subtitulo}</p> : null}

            <div className="mt-8 space-y-6">
              {PUNTOS.map((p) => (
                <div key={p.titulo} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl brand-gradient text-white">
                    <p.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{p.titulo}</h3>
                    <p className="mt-1 text-sm text-white/60">{p.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-white/40">
              Asistente BioDentis IA
            </p>
            <div className="space-y-3">
              <ChatBubble from="odontologo">
                Paciente con caries en 2.6, próxima cita para obturación con resina.
              </ChatBubble>
              <ChatBubble from="ia">
                Sugiero CUPS 232135 (obturación resina, unirradicular) y diagnóstico CIE-10 K02.1. ¿Genero el plan de tratamiento y el consentimiento asociado?
              </ChatBubble>
              <ChatBubble from="odontologo">Sí, y recuérdame pedir la firma antes de iniciar.</ChatBubble>
              <ChatBubble from="ia">
                Listo. Consentimiento generado y enviado al celular del paciente para firma. Te aviso cuando lo firme.
              </ChatBubble>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function ChatBubble({ from, children }: { from: "odontologo" | "ia"; children: ReactNode }) {
  const isIa = from === "ia";
  return (
    <div
      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
        isIa ? "ml-auto rounded-tr-none brand-gradient text-white" : "rounded-tl-none bg-white/10 text-white/80"
      }`}
    >
      {children}
    </div>
  );
}
