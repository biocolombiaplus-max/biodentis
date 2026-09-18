import "server-only";
import { prisma } from "@/lib/prisma";

type ItemProcedimiento = { cups?: string; descripcion?: string; diente?: string; valor?: string };
type Diagnostico = { codigo?: string; diente?: string };

function limpiarCodigo(texto?: string) {
  if (!texto) return "";
  return texto.trim().split(" ")[0];
}

/**
 * Genera los archivos planos RIPS (AC: consultas, AP: procedimientos, US: usuarios)
 * a partir de las historias clínicas del periodo. Estructura base según los campos
 * históricos de la normativa RIPS (Resolución 3374/2000 y actualizaciones posteriores,
 * incl. Resolución 866 de 2021). Debe validarse contra el anexo técnico vigente del
 * Ministerio de Salud antes de un reporte oficial.
 */
export async function generarArchivosRips(clinicaId: string, periodoInicio: Date, periodoFin: Date) {
  const historias = await prisma.historiaClinica.findMany({
    where: { clinicaId, fechaAtencion: { gte: periodoInicio, lte: periodoFin } },
    include: { paciente: true },
    orderBy: { fechaAtencion: "asc" },
  });

  const ac: string[] = [];
  const ap: string[] = [];
  const pacientesVistos = new Map<string, (typeof historias)[number]["paciente"]>();

  for (const h of historias) {
    pacientesVistos.set(h.paciente.id, h.paciente);
    const fecha = h.fechaAtencion.toISOString().slice(0, 10);
    const diagnosticos: Diagnostico[] = h.diagnosticosJson ? JSON.parse(h.diagnosticosJson) : [];
    const diagPrincipal = limpiarCodigo(diagnosticos[0]?.codigo) || "Z01.2";
    const diagRel1 = limpiarCodigo(diagnosticos[1]?.codigo);
    const diagRel2 = limpiarCodigo(diagnosticos[2]?.codigo);

    ac.push(
      [
        h.paciente.tipoDocumento,
        h.paciente.numeroDocumento,
        fecha,
        "", // numero de autorizacion
        "997211", // codigo de consulta CUPS por defecto (odontologia general)
        h.finalidadConsulta ?? "",
        h.causaExterna ?? "",
        diagPrincipal,
        diagRel1,
        diagRel2,
        "1", // tipo de diagnostico principal (1 = impresion diagnostica)
        "0",
        "0",
        "0",
      ].join(",")
    );

    const procedimientos: ItemProcedimiento[] = h.procedimientosRealizadosJson
      ? JSON.parse(h.procedimientosRealizadosJson)
      : [];

    for (const proc of procedimientos) {
      ap.push(
        [
          h.paciente.tipoDocumento,
          h.paciente.numeroDocumento,
          fecha,
          "",
          limpiarCodigo(proc.cups) || "997211",
          "1", // ambito: ambulatorio
          h.finalidadConsulta ?? "",
          "",
          diagPrincipal,
          diagRel1,
          "",
          "",
          proc.valor ?? "0",
        ].join(",")
      );
    }
  }

  const us: string[] = Array.from(pacientesVistos.values()).map((p) =>
    [
      p.tipoDocumento,
      p.numeroDocumento,
      "1", // tipo de usuario simplificado
      p.regimenAfiliacion,
      "", // codigo EPS/entidad responsable
      p.zonaResidencia ?? "",
      new Date().getFullYear() - p.fechaNacimiento.getFullYear(),
      p.sexo,
      p.departamento ?? "",
      p.municipio ?? "",
      p.zonaResidencia ?? "",
    ].join(",")
  );

  return { ac, ap, us, totalRegistros: ac.length + ap.length + us.length };
}
