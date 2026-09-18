"use client";

import Link from "next/link";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "#beneficios", label: "Beneficios" },
  { href: "#ia", label: "IA asistente" },
  { href: "#planes", label: "Planes" },
  { href: "#faq", label: "Preguntas" },
];

export function LandingHeader({
  nombre,
  logoUrl,
}: {
  nombre: string;
  logoUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={nombre} className="h-9 w-auto object-contain" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-xl brand-gradient text-sm font-extrabold text-white">
              {nombre.charAt(0)}
            </span>
          )}
          <span className="text-base font-bold text-[var(--brand-accent)] sm:text-lg">{nombre}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-slate-600 hover:text-[var(--brand-primary)]">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-[var(--brand-primary)]">
            Ingresar
          </Link>
          <ButtonLink href="#cta-final" size="md">
            Agenda una demo
          </ButtonLink>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 md:hidden"
          aria-label="Abrir menú"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open ? (
        <div className="border-t border-black/5 bg-white px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-slate-700"
              >
                {link.label}
              </a>
            ))}
            <Link href="/login" className="text-sm font-semibold text-[var(--brand-primary)]">
              Ingresar
            </Link>
            <ButtonLink href="#cta-final" size="md" className="justify-center">
              Agenda una demo
            </ButtonLink>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
