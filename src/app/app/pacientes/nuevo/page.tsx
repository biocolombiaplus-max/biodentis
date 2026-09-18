import { PacienteForm } from "@/components/pacientes/paciente-form";

export default function NuevoPacientePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--brand-accent)]">Nuevo paciente</h1>
      <p className="mt-1 text-sm text-slate-500">Registra la información exigida para historia clínica y RIPS.</p>
      <div className="mt-6 max-w-3xl">
        <PacienteForm />
      </div>
    </div>
  );
}
