import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, ctx: RouteContext<"/app/rips/[id]/descargar">) {
  const session = await requireSession();
  const { id } = await ctx.params;

  const registro = await prisma.ripsExport.findUnique({ where: { id } });
  if (!registro || registro.clinicaId !== session.clinicaId) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const { ac, ap, us } = JSON.parse(registro.contenido) as { ac: string[]; ap: string[]; us: string[] };

  const contenido = [
    "# Archivo AC - Consultas",
    ...ac,
    "",
    "# Archivo AP - Procedimientos",
    ...ap,
    "",
    "# Archivo US - Usuarios atendidos",
    ...us,
  ].join("\n");

  return new NextResponse(contenido, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="rips-${registro.id}.txt"`,
    },
  });
}
