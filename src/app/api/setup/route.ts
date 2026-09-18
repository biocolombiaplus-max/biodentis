import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed/run-seed";

/**
 * Endpoint protegido de un solo uso para crear los datos iniciales
 * (plan, consultorio demo, usuario admin) directamente desde el entorno
 * de Vercel, que sí tiene acceso de red a la base de datos.
 *
 * Requiere la variable de entorno SETUP_SECRET configurada en el proyecto
 * y visitar /api/setup?key=<ese-valor>. Es seguro llamarlo más de una vez
 * (usa upserts), pero se recomienda quitar SETUP_SECRET una vez montado
 * el consultorio real.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.SETUP_SECRET;
  const key = request.nextUrl.searchParams.get("key");

  if (!secret) {
    return NextResponse.json(
      { error: "SETUP_SECRET no está configurado en las variables de entorno del proyecto." },
      { status: 403 }
    );
  }

  if (!key || key !== secret) {
    return NextResponse.json({ error: "Clave inválida." }, { status: 403 });
  }

  try {
    const resultado = await seedDatabase(prisma);
    return NextResponse.json({
      ok: true,
      mensaje: "Datos iniciales creados correctamente.",
      clinica: resultado.clinica,
      adminEmail: resultado.adminEmail,
      adminPassword: "BioDentis2026*",
      recomendacion: "Inicia sesión, cambia estos datos desde /admin y luego elimina SETUP_SECRET del proyecto.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido al ejecutar el seed." },
      { status: 500 }
    );
  }
}
