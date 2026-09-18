import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { FacturaForm } from "@/components/facturacion/factura-form";

export default async function NuevaFacturaPage({
  searchParams,
}: {
  searchParams: Promise<{ pacienteId?: string }>;
}) {
  const session = await requireSession();
  const { pacienteId } = await searchParams;
  if (!pacienteId) notFound();

  const paciente = await prisma.paciente.findUnique({ where: { id: pacienteId } });
  if (!paciente || paciente.clinicaId !== session.clinicaId) notFound();

  const procedimientos = await prisma.procedimiento.findMany({
    where: { clinicaId: session.clinicaId, activo: true },
    orderBy: { nombre: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--brand-accent)]">
        Nueva factura · {paciente.primerNombre} {paciente.primerApellido}
      </h1>
      <div className="mt-6 max-w-2xl">
        <FacturaForm pacienteId={paciente.id} procedimientos={procedimientos} />
      </div>
    </div>
  );
}
