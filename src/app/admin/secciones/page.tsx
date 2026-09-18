import { getClinicaActiva } from "@/lib/clinica";
import { SeccionCard } from "@/components/admin/seccion-card";

export default async function AdminSeccionesPage() {
  const clinica = await getClinicaActiva();
  if (!clinica) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--brand-accent)]">Secciones de la landing</h1>
      <p className="mt-1 text-sm text-slate-500">
        Cambia el título, subtítulo e imagen de fondo de cada sección de tu página pública.
      </p>

      <div className="mt-6 space-y-6">
        {clinica.secciones.map((seccion) => (
          <SeccionCard key={seccion.id} seccion={seccion} />
        ))}
      </div>
    </div>
  );
}
