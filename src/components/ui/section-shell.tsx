import { type ReactNode } from "react";

type Tone = "light" | "mist" | "dark";

const toneClasses: Record<Tone, string> = {
  light: "bg-white",
  mist: "bg-[var(--brand-mist)]",
  dark: "bg-[var(--brand-ink)] text-white",
};

export function SectionShell({
  id,
  tone = "light",
  backgroundImageUrl,
  className = "",
  children,
}: {
  id?: string;
  tone?: Tone;
  backgroundImageUrl?: string | null;
  className?: string;
  children: ReactNode;
}) {
  if (backgroundImageUrl) {
    return (
      <section id={id} className={`section-bg-overlay py-20 sm:py-28 ${className}`}>
        <div
          className="section-bg-image"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
          aria-hidden
        />
        <div
          className="section-bg-scrim"
          style={{
            background:
              tone === "dark"
                ? "linear-gradient(180deg, rgba(20,10,38,0.88) 0%, rgba(20,10,38,0.94) 100%)"
                : "linear-gradient(180deg, rgba(255,255,255,0.93) 0%, rgba(255,255,255,0.97) 100%)",
          }}
          aria-hidden
        />
        <div className={`section-content ${tone === "dark" ? "text-white" : ""}`}>{children}</div>
      </section>
    );
  }

  return (
    <section id={id} className={`py-20 sm:py-28 ${toneClasses[tone]} ${className}`}>
      {children}
    </section>
  );
}
