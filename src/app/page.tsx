import { getLandingData, seccionPorClave } from "@/lib/clinica";
import { AnnouncementBar } from "@/components/landing/announcement-bar";
import { LandingHeader } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Confianza } from "@/components/landing/confianza";
import { Beneficios } from "@/components/landing/beneficios";
import { ComoFunciona } from "@/components/landing/como-funciona";
import { IaSection } from "@/components/landing/ia";
import { Personalizacion } from "@/components/landing/personalizacion";
import { PlanesSection } from "@/components/landing/planes";
import { TestimoniosSection } from "@/components/landing/testimonios";
import { Faq } from "@/components/landing/faq";
import { CtaFinal } from "@/components/landing/cta-final";
import { LandingFooter } from "@/components/landing/footer";

export default async function LandingPage() {
  const data = await getLandingData();

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--brand-ink)] px-6 text-center text-white">
        <div>
          <h1 className="text-2xl font-bold">BioDentis aún no está configurado</h1>
          <p className="mt-2 text-white/60">
            Ejecuta <code className="rounded bg-white/10 px-2 py-1">npm run db:seed</code> para crear tu primer
            consultorio de demostración.
          </p>
        </div>
      </main>
    );
  }

  const { clinica, secciones, planes, testimonios } = data;
  const s = (clave: string) => seccionPorClave(secciones, clave);

  return (
    <>
      <AnnouncementBar />
      <LandingHeader nombre={clinica.nombre} logoUrl={clinica.logoUrl} />

      <main>
        <Hero
          titulo={s("hero")?.titulo ?? "El software que tu consultorio odontológico necesita"}
          subtitulo={
            s("hero")?.subtitulo ??
            "Historia clínica, agenda, consentimientos, facturación y RIPS en un solo lugar, con IA que te guía en cada paso."
          }
          backgroundImageUrl={s("hero")?.imagenFondoUrl}
        />

        <Confianza
          titulo={s("confianza")?.titulo ?? "Cumplimiento normativo desde el primer día"}
          subtitulo={s("confianza")?.subtitulo}
          backgroundImageUrl={s("confianza")?.imagenFondoUrl}
        />

        <Beneficios
          titulo={s("beneficios")?.titulo ?? "Todo lo que tu consultorio necesita, en un solo software"}
          subtitulo={s("beneficios")?.subtitulo}
          backgroundImageUrl={s("beneficios")?.imagenFondoUrl}
        />

        <ComoFunciona
          titulo={s("como_funciona")?.titulo ?? "Empieza a usarlo en menos de un día"}
          subtitulo={s("como_funciona")?.subtitulo}
          backgroundImageUrl={s("como_funciona")?.imagenFondoUrl}
        />

        <IaSection
          titulo={s("ia")?.titulo ?? "Inteligencia artificial que trabaja contigo"}
          subtitulo={s("ia")?.subtitulo}
          backgroundImageUrl={s("ia")?.imagenFondoUrl}
        />

        <Personalizacion
          titulo={s("personalizacion")?.titulo ?? "Tu marca, tu consultorio, tu identidad"}
          subtitulo={s("personalizacion")?.subtitulo}
          backgroundImageUrl={s("personalizacion")?.imagenFondoUrl}
        />

        <PlanesSection
          titulo={s("planes")?.titulo ?? "Planes para cada tamaño de consultorio"}
          subtitulo={s("planes")?.subtitulo}
          planes={planes}
          backgroundImageUrl={s("planes")?.imagenFondoUrl}
        />

        <TestimoniosSection
          titulo={s("testimonios")?.titulo ?? "Consultorios que ya confían en BioDentis"}
          testimonios={testimonios}
          backgroundImageUrl={s("testimonios")?.imagenFondoUrl}
        />

        <Faq titulo={s("faq")?.titulo ?? "Preguntas frecuentes"} />

        <CtaFinal
          titulo={s("cta_final")?.titulo ?? "Moderniza tu consultorio hoy"}
          subtitulo={s("cta_final")?.subtitulo ?? "Agenda una demo y descubre cómo BioDentis simplifica tu día a día."}
          whatsapp={clinica.whatsapp}
        />
      </main>

      <LandingFooter
        nombre={clinica.nombre}
        logoUrl={clinica.logoUrl}
        slogan={clinica.slogan}
        telefono={clinica.telefono}
        email={clinica.email}
        direccion={clinica.direccion}
        ciudad={clinica.ciudad}
      />
    </>
  );
}
