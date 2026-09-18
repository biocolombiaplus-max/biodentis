import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { HistoriaForm } from "@/components/historias/historia-form";

export default async function NuevaHistoriaPage({
  searchParams,
}: {
  searchParams: Promise<{ pacienteId?: string }>;
}) {
  const session = await requireSession();
  const { pacienteId } = await searchParams;

  if (!pacienteId) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white p-8 text-center">
        <p className="text-slate-600">Selecciona primero un paciente para crear su historia clínica.</p>
        <Link href="/app/pacientes" className="mt-3 inline-block text-sm font-semibold text-[var(--brand-primary)]">
          Ir a pacientes →
        </Link>
      </div>
    );
  }

  const paciente = await prisma.paciente.findUnique({ where: { id: pacienteId } });
  if (!paciente || paciente.clinicaId !== session.clinicaId) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--brand-accent)]">
        Nueva historia clínica · {paciente.primerNombre} {paciente.primerApellido}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Estructurada según los contenidos mínimos de la Resolución 3100 de 2019.
      </p>
      <div className="mt-6 max-w-4xl">
        <HistoriaForm pacienteId={paciente.id} />
      </div>
    </div>
  );
}
