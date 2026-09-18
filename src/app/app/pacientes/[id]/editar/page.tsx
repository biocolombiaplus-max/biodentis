import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { PacienteForm } from "@/components/pacientes/paciente-form";

export default async function EditarPacientePage({ params }: PageProps<"/app/pacientes/[id]/editar">) {
  const session = await requireSession();
  const { id } = await params;

  const paciente = await prisma.paciente.findUnique({ where: { id } });
  if (!paciente || paciente.clinicaId !== session.clinicaId) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--brand-accent)]">
        Editar paciente: {paciente.primerNombre} {paciente.primerApellido}
      </h1>
      <div className="mt-6 max-w-3xl">
        <PacienteForm paciente={paciente} />
      </div>
    </div>
  );
}
