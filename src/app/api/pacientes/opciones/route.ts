import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const pacientes = await prisma.paciente.findMany({
    where: { clinicaId: session.clinicaId },
    orderBy: { primerNombre: "asc" },
    take: 500,
  });

  return NextResponse.json(
    pacientes.map((p) => ({
      id: p.id,
      nombre: `${p.primerNombre} ${p.primerApellido} · ${p.tipoDocumento} ${p.numeroDocumento}`,
    }))
  );
}
