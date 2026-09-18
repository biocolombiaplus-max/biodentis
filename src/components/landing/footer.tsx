import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export function LandingFooter({
  nombre,
  logoUrl,
  slogan,
  telefono,
  email,
  direccion,
  ciudad,
}: {
  nombre: string;
  logoUrl?: string | null;
  slogan?: string | null;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
}) {
  return (
    <footer className="bg-[var(--brand-ink)] pb-8 pt-16 text-white/60">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt={nombre} className="h-8 w-auto object-contain" />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-lg brand-gradient text-xs font-bold text-white">
                  {nombre.charAt(0)}
                </span>
              )}
              <span className="font-bold text-white">{nombre}</span>
            </div>
            {slogan ? <p className="mt-3 text-sm">{slogan}</p> : null}
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Producto</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#beneficios" className="hover:text-white">Beneficios</a></li>
              <li><a href="#ia" className="hover:text-white">Asistente de IA</a></li>
              <li><a href="#planes" className="hover:text-white">Planes</a></li>
              <li><a href="#faq" className="hover:text-white">Preguntas frecuentes</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/legal/terminos" className="hover:text-white">Términos y condiciones</Link></li>
              <li><Link href="/legal/privacidad" className="hover:text-white">Política de privacidad</Link></li>
              <li><Link href="/legal/habeas-data" className="hover:text-white">Tratamiento de datos (Habeas Data)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Contacto</h4>
            <ul className="space-y-2.5 text-sm">
              {telefono ? (
                <li className="flex items-center gap-2"><Phone size={14} /> {telefono}</li>
              ) : null}
              {email ? (
                <li className="flex items-center gap-2"><Mail size={14} /> {email}</li>
              ) : null}
              {(direccion || ciudad) ? (
                <li className="flex items-center gap-2"><MapPin size={14} /> {[direccion, ciudad].filter(Boolean).join(", ")}</li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs">
          © {new Date().getFullYear()} {nombre}. Todos los derechos reservados. Software construido con BioDentis.
        </div>
      </div>
    </footer>
  );
}
