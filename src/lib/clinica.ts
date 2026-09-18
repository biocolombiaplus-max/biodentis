import "server-only";
import { prisma } from "@/lib/prisma";
import type { SeccionLanding } from "@prisma/client";

/**
 * BioDentis se despliega como una instancia por consultorio: siempre hay
 * una única clínica activa, personalizable desde /admin. Este helper
 * resuelve esa clínica (la primera creada) en toda la app pública y en
 * el panel administrativo.
 */
export async function getClinicaActiva() {
  const clinica = await prisma.clinica.findFirst({
    orderBy: { createdAt: "asc" },
    include: {
      plan: true,
      secciones: { orderBy: { orden: "asc" } },
    },
  });
  return clinica;
}

export async function getSeccionesLanding(clinicaId: string) {
  return prisma.seccionLanding.findMany({
    where: { clinicaId },
    orderBy: { orden: "asc" },
  });
}

export function seccionPorClave(secciones: SeccionLanding[], clave: string) {
  return secciones.find((s) => s.clave === clave);
}

export async function getLandingData() {
  const clinica = await getClinicaActiva();
  if (!clinica) return null;

  const [planes, testimonios] = await Promise.all([
    prisma.plan.findMany({ where: { activo: true }, orderBy: { orden: "asc" } }),
    prisma.testimonio.findMany({
      where: { clinicaId: clinica.id, visible: true },
      orderBy: { orden: "asc" },
    }),
  ]);

  return { clinica, secciones: clinica.secciones, planes, testimonios };
}

