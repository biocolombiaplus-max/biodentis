import { ButtonLink } from "@/components/ui/button";

export function CtaFinal({
  titulo,
  subtitulo,
  whatsapp,
}: {
  titulo: string;
  subtitulo?: string | null;
  whatsapp?: string | null;
}) {
  return (
    <section id="cta-final" className="brand-gradient relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_45%)]" />
      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{titulo}</h2>
        {subtitulo ? <p className="mt-4 text-lg text-white/85">{subtitulo}</p> : null}

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {whatsapp ? (
            <ButtonLink
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hola, quiero conocer más sobre BioDentis para mi consultorio")}`}
              variant="dark"
              size="lg"
              target="_blank"
            >
              Escríbenos por WhatsApp
            </ButtonLink>
          ) : null}
          <ButtonLink href="/login" size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--brand-primary)]">
            Ya soy cliente, ingresar
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
