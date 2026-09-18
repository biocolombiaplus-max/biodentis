import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { generarEnlaceFirmaAction, firmarEnConsultorioAction } from "@/lib/consentimientos/actions";
import { SignaturePad } from "@/components/shared/signature-pad";
import { CopyLinkBox } from "@/components/consentimientos/copy-link-box";
import { formatFechaCorta } from "@/lib/format";

export default async function ConsentimientoDetallePage({ params }: PageProps<"/app/consentimientos/[id]">) {
  const session = await requireSession();
  const { id } = await params;

  const consentimiento = await prisma.consentimientoInformado.findUnique({
    where: { id },
    include: { paciente: true },
  });
  if (!consentimiento || consentimiento.paciente.clinicaId !== session.clinicaId) notFound();

  const enlaceFirma = consentimiento.tokenFirmaRemota
    ? `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/firmar/${consentimiento.tokenFirmaRemota}`
    : null;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-[var(--brand-accent)]">{consentimiento.titulo}</h1>
      <p className="mt-1 text-sm text-slate-500">
        Paciente: {consentimiento.paciente.primerNombre} {consentimiento.paciente.primerApellido} ·{" "}
        {consentimiento.paciente.tipoDocumento} {consentimiento.paciente.numeroDocumento}
      </p>

      <section className="mt-6 rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-bold text-[var(--brand-accent)]">Contenido</h2>
        <p className="mt-2 whitespace-pre-line text-sm text-slate-600">{consentimiento.contenido}</p>
      </section>

      {consentimiento.estado === "FIRMADO" ? (
        <section className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="font-bold text-emerald-700">Firmado</h2>
          <p className="mt-1 text-sm text-emerald-700">
            El {consentimiento.firmadoEn ? formatFechaCorta(consentimiento.firmadoEn) : ""}
            {consentimiento.dispositivo ? ` · ${consentimiento.dispositivo.slice(0, 60)}` : ""}
          </p>
          {consentimiento.firmaPacienteBase64 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={consentimiento.firmaPacienteBase64}
              alt="Firma del paciente"
              className="mt-3 h-28 rounded-lg border border-emerald-200 bg-white"
            />
          ) : null}
        </section>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <section className="rounded-2xl border border-black/5 bg-white p-6">
            <h2 className="font-bold text-[var(--brand-accent)]">Firmar en este dispositivo</h2>
            <p className="mt-1 text-xs text-slate-500">
              Entrega el celular o la tablet del consultorio al paciente para que firme con el dedo.
            </p>
            <form action={firmarEnConsultorioAction} className="mt-4 space-y-4">
              <input type="hidden" name="id" value={consentimiento.id} />
              <SignaturePad name="firmaPacienteBase64" label="Firma del paciente" />
              <input
                name="nombreTestigo"
                placeholder="Nombre del testigo (opcional)"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <button type="submit" className="brand-gradient w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white">
                Registrar firma
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-6">
            <h2 className="font-bold text-[var(--brand-accent)]">Enviar para firma a distancia</h2>
            <p className="mt-1 text-xs text-slate-500">
              Genera un enlace seguro para que el paciente firme desde su propio celular.
            </p>

            {enlaceFirma ? (
              <div className="mt-4">
                <CopyLinkBox link={enlaceFirma} />
                {consentimiento.paciente.celular ? (
                  <a
                    href={`https://wa.me/57${consentimiento.paciente.celular.replace(/\D/g, "")}?text=${encodeURIComponent(
                      `Hola ${consentimiento.paciente.primerNombre}, por favor firma tu consentimiento informado aquí: ${enlaceFirma}`
                    )}`}
                    target="_blank"
                    className="mt-3 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Enviar por WhatsApp
                  </a>
                ) : null}
              </div>
            ) : (
              <form action={generarEnlaceFirmaAction} className="mt-4">
                <input type="hidden" name="id" value={consentimiento.id} />
                <button type="submit" className="brand-gradient w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white">
                  Generar enlace de firma
                </button>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
