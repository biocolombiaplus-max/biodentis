import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  FileText,
  PenTool,
  CalendarClock,
  Receipt,
  FileBarChart,
  Settings,
  LogOut,
} from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";
import type { SessionPayload } from "@/lib/auth/session";

const NAV = [
  { href: "/app", label: "Panel", icon: LayoutDashboard },
  { href: "/app/pacientes", label: "Pacientes", icon: Users },
  { href: "/app/historias", label: "Historias clínicas", icon: FileText },
  { href: "/app/consentimientos", label: "Consentimientos", icon: PenTool },
  { href: "/app/citas", label: "Agenda", icon: CalendarClock },
  { href: "/app/facturacion", label: "Facturación", icon: Receipt },
  { href: "/app/rips", label: "RIPS", icon: FileBarChart },
];

export function AppShell({
  children,
  session,
  nombreClinica,
  logoUrl,
}: {
  children: React.ReactNode;
  session: SessionPayload;
  nombreClinica: string;
  logoUrl?: string | null;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-black/5 bg-white sm:flex">
        <div className="flex items-center gap-2.5 border-b border-black/5 px-5 py-5">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={nombreClinica} className="h-8 w-auto object-contain" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg brand-gradient text-xs font-bold text-white">
              {nombreClinica.charAt(0)}
            </span>
          )}
          <span className="truncate text-sm font-bold text-[var(--brand-accent)]">{nombreClinica}</span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-[var(--brand-mist)] hover:text-[var(--brand-primary)]"
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          ))}
          {session.rol === "ADMIN" ? (
            <Link
              href="/admin/marca"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-[var(--brand-mist)] hover:text-[var(--brand-primary)]"
            >
              <Settings size={17} /> Configuración
            </Link>
          ) : null}
        </nav>

        <div className="border-t border-black/5 p-3">
          <div className="mb-2 rounded-xl bg-slate-50 px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-[var(--brand-accent)]">{session.nombre}</p>
            <p className="text-xs capitalize text-slate-500">{session.rol.toLowerCase()}</p>
          </div>
          <form action={logoutAction}>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
              <LogOut size={17} /> Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 px-5 py-8 sm:px-10">{children}</main>
    </div>
  );
}
