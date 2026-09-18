import { requireRole } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { TestimonioForm } from "@/components/admin/testimonio-form";

export default async function AdminTestimoniosPage() {
  const session = await requireRole(["ADMIN"]);
  const testimonios = await prisma.testimonio.findMany({
    where: { clinicaId: session.clinicaId },
    orderBy: { orden: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--brand-accent)]">Testimonios</h1>
      <p className="mt-1 text-sm text-slate-500">
        Reemplaza los testimonios de ejemplo con opiniones reales de tus pacientes antes de publicar tu página.
      </p>

      <div className="mt-6 space-y-5">
        {testimonios.map((t) => (
          <TestimonioForm key={t.id} testimonio={t} />
        ))}

        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-500">Agregar nuevo</h2>
          <TestimonioForm />
        </div>
      </div>
    </div>
  );
}
