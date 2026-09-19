import { NextResponse } from "next/server";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { DEMO_CLINICA_ID } from "@/lib/demo/constants";

/**
 * Punto de entrada de la demo pública: un clic, sin registro. Crea una
 * sesión de solo lectura apuntando al "consultorio sandbox" (datos
 * ficticios y aislados, nunca a datos reales de un consultorio real).
 */
export async function GET(request: Request) {
  const token = await createSessionToken({
    userId: "visitante-demo",
    clinicaId: DEMO_CLINICA_ID,
    rol: "ADMIN",
    nombre: "Visitante Demo",
    email: "demo@biodentis.co",
    esDemo: true,
  });

  await setSessionCookie(token);

  return NextResponse.redirect(new URL("/app", request.url));
}
