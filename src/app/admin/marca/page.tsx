import { getClinicaActiva } from "@/lib/clinica";
import { MarcaForm } from "@/components/admin/marca-form";

export default async function AdminMarcaPage() {
  const clinica = await getClinicaActiva();
  if (!clinica) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--brand-accent)]">Marca y apariencia</h1>
      <p className="mt-1 text-sm text-slate-500">
        Estos datos y colores se usan en toda tu página pública y en el panel del consultorio.
      </p>
      <div className="mt-6">
        <MarcaForm clinica={clinica} />
      </div>
    </div>
  );
}
