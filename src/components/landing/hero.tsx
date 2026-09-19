import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export function Hero({
  titulo,
  subtitulo,
  backgroundImageUrl,
}: {
  titulo: string;
  subtitulo: string;
  backgroundImageUrl?: string | null;
}) {
  return (
    <section className="relative overflow-hidden bg-[var(--brand-ink)] pb-24 pt-16 sm:pb-32 sm:pt-24">
      {backgroundImageUrl ? (
        <div
          className="absolute inset-0 opacity-25"
          style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
          aria-hidden
        />
      ) : null}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="brand-gradient animate-float-blob absolute -top-40 -left-32 h-[28rem] w-[28rem] rounded-full opacity-40 blur-3xl" />
        <div className="brand-gradient animate-float-blob absolute -bottom-40 right-0 h-[26rem] w-[26rem] rounded-full opacity-30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Alineado con la Resolución 3100 · RIPS · Habeas Data
          </span>

          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl">
            {titulo.split(" que ")[0]}
            {titulo.includes(" que ") ? (
              <>
                {" que "}
                <span className="brand-gradient-text">{titulo.split(" que ").slice(1).join(" que ")}</span>
              </>
            ) : (
              <span className="brand-gradient-text"> {titulo}</span>
            )}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">{subtitulo}</p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink href="/api/demo" size="lg" className="shadow-xl shadow-fuchsia-900/40">
              Ver demo en vivo <ArrowRight size={18} className="ml-1" />
            </ButtonLink>
            <ButtonLink href="#planes" size="lg" variant="outline" className="border-white/30 text-white hover:bg-white hover:text-[var(--brand-ink)]">
              Ver planes y precios
            </ButtonLink>
          </div>

          <p className="mt-4 text-sm text-white/50">
            Sin registro, sin tarjeta ·{" "}
            <a href="#cta-final" className="underline decoration-white/30 underline-offset-2 hover:text-white">
              o agenda una demo guiada con nuestro equipo
            </a>
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-white/50">
            <span>✓ Sin instalar software</span>
            <span>✓ Soporte en Colombia</span>
            <span>✓ Cancela cuando quieras</span>
          </div>
        </div>

        <HeroMockup />
      </div>
    </section>
  );
}

function HeroMockup() {
  return (
    <Link href="/api/demo" className="group relative mx-auto mt-16 block max-w-4xl">
      <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/15 bg-[var(--brand-ink)] px-4 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
        Haz clic para explorarlo tú mismo →
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 shadow-2xl backdrop-blur transition-transform duration-500 group-hover:-translate-y-1 group-hover:border-white/20">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-3 text-xs text-white/40">app.biodentis.co · Panel del consultorio</span>
        </div>
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white/[0.06] p-4">
            <p className="text-xs text-white/40">Pacientes atendidos hoy</p>
            <p className="mt-2 text-3xl font-bold text-white">18</p>
            <p className="mt-1 text-xs text-emerald-400">+12% vs. la semana pasada</p>
          </div>
          <div className="rounded-xl bg-white/[0.06] p-4">
            <p className="text-xs text-white/40">Consentimientos firmados</p>
            <p className="mt-2 text-3xl font-bold text-white">7 / 7</p>
            <p className="mt-1 text-xs text-white/40">100% con firma digital</p>
          </div>
          <div className="rounded-xl bg-white/[0.06] p-4">
            <p className="text-xs text-white/40">RIPS del mes</p>
            <p className="mt-2 text-3xl font-bold text-white">Listo</p>
            <p className="mt-1 text-xs text-white/40">Generado automáticamente</p>
          </div>
          <div className="col-span-full rounded-xl bg-white/[0.06] p-4">
            <p className="mb-3 text-xs text-white/40">Asistente de IA · Historia clínica</p>
            <div className="space-y-2">
              <div className="max-w-md rounded-lg rounded-tl-none bg-white/10 px-3 py-2 text-sm text-white/80">
                Paciente refiere dolor en molar inferior derecho hace 3 días, sensible al frío.
              </div>
              <div className="ml-auto max-w-md rounded-lg rounded-tr-none px-3 py-2 text-sm text-white brand-gradient">
                Sugerencia: revisar posible pulpitis reversible (K04.0). ¿Registro examen intraoral y plan de tratamiento?
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
