import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getClinicaActiva } from "@/lib/clinica";
import { FirmaRemotaForm } from "@/components/consentimientos/firma-remota-form";

export default async function FirmarPage({ params }: PageProps<"/firmar/[token]">) {
  const { token } = await params;

  const consentimiento = await prisma.consentimientoInformado.findUnique({
    where: { tokenFirmaRemota: token },
    include: { paciente: true },
  });
  if (!consentimiento) notFound();

  const clinica = await getClinicaActiva();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 text-center">
          {clinica?.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={clinica.logoUrl} alt={clinica.nombre} className="mx-auto h-10 object-contain" />
          ) : (
            <p className="text-lg font-bold text-[var(--brand-accent)]">{clinica?.nombre}</p>
          )}
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-6">
          <h1 className="text-xl font-bold text-[var(--brand-accent)]">{consentimiento.titulo}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Paciente: {consentimiento.paciente.primerNombre} {consentimiento.paciente.primerApellido}
          </p>
          <p className="mt-4 whitespace-pre-line text-sm text-slate-600">{consentimiento.contenido}</p>
        </div>

        <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6">
          <h2 className="mb-3 font-bold text-[var(--brand-accent)]">Firma para autorizar</h2>
          {consentimiento.estado === "FIRMADO" ? (
            <p className="text-sm text-emerald-600">Este consentimiento ya fue firmado. ¡Gracias!</p>
          ) : (
            <FirmaRemotaForm token={token} />
          )}
        </div>
      </div>
    </main>
  );
}
