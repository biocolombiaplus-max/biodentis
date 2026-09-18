import { requireRole } from "@/lib/auth/guard";
import { getClinicaActiva } from "@/lib/clinica";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  await requireRole(["ADMIN"]);
  const clinica = await getClinicaActiva();

  return <AdminShell nombreClinica={clinica?.nombre ?? "Tu consultorio"}>{children}</AdminShell>;
}
