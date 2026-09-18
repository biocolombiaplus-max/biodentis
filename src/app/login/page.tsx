import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { getClinicaActiva } from "@/lib/clinica";

export default async function LoginPage() {
  const clinica = await getClinicaActiva();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--brand-ink)] px-4 py-12">
      <div className="absolute inset-0 overflow-hidden">
        <div className="brand-gradient animate-float-blob absolute -top-32 -left-24 h-96 w-96 rounded-full opacity-30 blur-3xl" />
        <div className="brand-gradient animate-float-blob absolute -bottom-32 -right-24 h-96 w-96 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          {clinica?.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={clinica.logoUrl} alt={clinica.nombre} className="mx-auto mb-4 h-12 object-contain" />
          ) : (
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient text-lg font-bold text-white">
              {clinica?.nombre?.charAt(0) ?? "B"}
            </div>
          )}
          <h1 className="text-xl font-semibold text-white">{clinica?.nombre ?? "BioDentis"}</h1>
          <p className="mt-1 text-sm text-white/50">Ingresa al panel de tu consultorio</p>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-white/40">
          <Link href="/" className="hover:text-white/70">
            ← Volver al sitio
          </Link>
        </p>
      </div>
    </main>
  );
}
