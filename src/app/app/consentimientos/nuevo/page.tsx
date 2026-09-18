import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { NuevoConsentimientoForm } from "@/components/consentimientos/nuevo-consentimiento-form";

export default async function NuevoConsentimientoPage({
  searchParams,
}: {
  searchParams: Promise<{ pacienteId?: string }>;
}) {
  const session = await requireSession();
  const { pacienteId } = await searchParams;
  if (!pacienteId) notFound();

  const paciente = await prisma.paciente.findUnique({ where: { id: pacienteId } });
  if (!paciente || paciente.clinicaId !== session.clinicaId) notFound();

  const plantillas = await prisma.plantillaConsentimiento.findMany({
    where: { clinicaId: session.clinicaId, activo: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--brand-accent)]">
        Nuevo consentimiento · {paciente.primerNombre} {paciente.primerApellido}
      </h1>
      <div className="mt-6 max-w-2xl">
        <NuevoConsentimientoForm pacienteId={paciente.id} plantillas={plantillas} />
      </div>
    </div>
  );
}
