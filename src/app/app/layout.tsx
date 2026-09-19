import { requireSession } from "@/lib/auth/guard";
import { getClinicaPorId } from "@/lib/clinica";
import { AppShell } from "@/components/app/app-shell";

export default async function AppLayout({ children }: LayoutProps<"/app">) {
  const session = await requireSession();
  const clinica = await getClinicaPorId(session.clinicaId);

  return (
    <AppShell session={session} nombreClinica={clinica?.nombre ?? "Tu consultorio"} logoUrl={clinica?.logoUrl}>
      {children}
    </AppShell>
  );
}
