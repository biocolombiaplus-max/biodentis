import { prisma } from "@/lib/prisma";
import { PlanCard } from "@/components/admin/plan-card";

export default async function AdminPlanesPage() {
  const planes = await prisma.plan.findMany({ orderBy: { orden: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--brand-accent)]">Planes y precios</h1>
      <p className="mt-1 text-sm text-slate-500">
        Ajusta precios y características según tu estrategia comercial. Solo un plan puede estar &ldquo;recomendado&rdquo;.
      </p>

      <div className="mt-6 space-y-6">
        {planes.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}
