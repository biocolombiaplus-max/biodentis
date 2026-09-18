import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getClinicaActiva } from "@/lib/clinica";

// El contenido (marca, colores, textos) se edita desde /admin y debe
// reflejarse de inmediato, por eso toda la app se renderiza dinámicamente.
export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const clinica = await getClinicaActiva();
  const nombre = clinica?.nombre ?? "BioDentis";
  const slogan = clinica?.slogan ?? "Software para consultorios odontológicos en Colombia";
  return {
    title: `${nombre} · Software para consultorio odontológico`,
    description: slogan,
    icons: clinica?.faviconUrl ? [{ url: clinica.faviconUrl }] : undefined,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const clinica = await getClinicaActiva();

  const brandStyle = clinica
    ? ({
        "--brand-primary": clinica.colorPrimario,
        "--brand-primary-light": clinica.colorSecundario,
        "--brand-secondary": clinica.colorSecundario,
        "--brand-accent": clinica.colorAcento,
        "--brand-ink": clinica.colorAcento,
      } as React.CSSProperties)
    : undefined;

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={brandStyle}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
