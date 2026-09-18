import Link from "next/link";
import { Palette, LayoutTemplate, CreditCard, Quote, ArrowLeftRight, LogOut } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";

const NAV = [
  { href: "/admin/marca", label: "Marca y apariencia", icon: Palette },
  { href: "/admin/secciones", label: "Secciones de la landing", icon: LayoutTemplate },
  { href: "/admin/planes", label: "Planes y precios", icon: CreditCard },
  { href: "/admin/testimonios", label: "Testimonios", icon: Quote },
];

export function AdminShell({ children, nombreClinica }: { children: React.ReactNode; nombreClinica: string }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-black/5 bg-white sm:flex">
        <div className="border-b border-black/5 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Administración</p>
          <p className="mt-0.5 truncate font-bold text-[var(--brand-accent)]">{nombreClinica}</p>
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
        </nav>
        <div className="space-y-1 border-t border-black/5 p-3">
          <Link
            href="/app"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeftRight size={17} /> Ir al panel clínico
          </Link>
          <form action={logoutAction}>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
              <LogOut size={17} /> Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 px-5 py-8 sm:px-10">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
