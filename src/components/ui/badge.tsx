import { type ReactNode } from "react";

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--brand-primary)]/20 bg-[var(--brand-mist)] px-3 py-1 text-xs font-semibold text-[var(--brand-primary-dark)] ${className}`}
    >
      {children}
    </span>
  );
}

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[var(--brand-primary)]">
      {children}
    </p>
  );
}
