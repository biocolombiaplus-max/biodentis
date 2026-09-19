import { PrismaClient, TipoDocumento, RegimenAfiliacion, RolUsuario } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { DEMO_CLINICA_ID } from "@/lib/demo/constants";

const PROFESIONAL_ID = "usuario-demo-profesional";

// Firma de ejemplo (trazo simple) codificada en base64, para que los
// consentimientos y la historia firmada de la demo se vean reales.
const FIRMA_EJEMPLO =
  "data:image/svg+xml;base64," +
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="120"><path d="M20 80 C 60 20, 90 100, 130 50 S 200 20, 230 70 S 270 40, 280 60" stroke="#1B1035" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`
  ).toString("base64");

function haceDias(dias: number) {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return d;
}

function enHoras(horas: number) {
  const d = new Date();
  d.setHours(d.getHours() + horas);
  d.setMinutes(0, 0, 0);
  return d;
}

const PACIENTES = [
  {
    id: "paciente-demo-1",
    tipoDocumento: TipoDocumento.CC,
    numeroDocumento: "1099887766",
    primerNombre: "Mariana",
    primerApellido: "Torres",
    fechaNacimiento: new Date("1996-03-22"),
    sexo: "F",
    regimenAfiliacion: RegimenAfiliacion.CONTRIBUTIVO,
    eps: "Sura EPS",
    zonaResidencia: "U",
    departamento: "Antioquia",
    municipio: "Medellín",
    celular: "3109988776",
    email: "mariana.torres@example.com",
    habeasDataAceptado: true,
  },
  {
    id: "paciente-demo-2",
    tipoDocumento: TipoDocumento.CC,
    numeroDocumento: "80234455",
    primerNombre: "Andrés",
    primerApellido: "Higuita",
    fechaNacimiento: new Date("1988-11-05"),
    sexo: "M",
    regimenAfiliacion: RegimenAfiliacion.SUBSIDIADO,
    eps: "Coosalud",
    zonaResidencia: "R",
    departamento: "Valle del Cauca",
    municipio: "Cali",
    celular: "3201122334",
    email: "andres.higuita@example.com",
    habeasDataAceptado: true,
  },
  {
    id: "paciente-demo-3",
    tipoDocumento: TipoDocumento.TI,
    numeroDocumento: "1035678901",
    primerNombre: "Sofía",
    primerApellido: "Ramírez",
    fechaNacimiento: new Date("2011-07-14"),
    sexo: "F",
    regimenAfiliacion: RegimenAfiliacion.CONTRIBUTIVO,
    eps: "Nueva EPS",
    zonaResidencia: "U",
    departamento: "Bogotá D.C.",
    municipio: "Bogotá",
    acudienteNombre: "Claudia Ramírez",
    acudienteTelefono: "3115566778",
    habeasDataAceptado: true,
  },
];

const PROCEDIMIENTOS = [
  { codigoCups: "997211", nombre: "Consulta de primera vez odontología general", valor: 65000 },
  { codigoCups: "997511", nombre: "Profilaxis y control de placa bacteriana", valor: 85000 },
  { codigoCups: "232135", nombre: "Obturación resina en diente unirradicular", valor: 130000 },
  { codigoCups: "230130", nombre: "Blanqueamiento dental ambulatorio", valor: 380000 },
];

export async function seedDemoSandbox(prisma: PrismaClient) {
  const clinica = await prisma.clinica.upsert({
    where: { id: DEMO_CLINICA_ID },
    update: {},
    create: {
      id: DEMO_CLINICA_ID,
      nombre: "Consultorio Demo — BioDentis",
      nit: "900000000-0",
      slogan: "Así se ve BioDentis por dentro",
      telefono: "(601) 000 0000",
      whatsapp: "573000000000",
      email: "demo@biodentis.co",
      direccion: "Datos de ejemplo",
      ciudad: "Bogotá D.C.",
      colorPrimario: "#D6006E",
      colorSecundario: "#FF4FA0",
      colorAcento: "#1B1035",
    },
  });

  const passwordHash = await bcrypt.hash(randomUUID(), 10);
  const profesional = await prisma.usuario.upsert({
    where: { id: PROFESIONAL_ID },
    update: {},
    create: {
      id: PROFESIONAL_ID,
      clinicaId: clinica.id,
      nombre: "Dra. Valentina Ruiz",
      email: "profesional@demo.biodentis.co",
      passwordHash,
      rol: RolUsuario.ODONTOLOGO,
      registroProfesional: "RETHUS-DEMO-0001",
    },
  });

  for (const p of PACIENTES) {
    await prisma.paciente.upsert({
      where: { id: p.id },
      update: {},
      create: { ...p, clinicaId: clinica.id },
    });
  }

  for (const proc of PROCEDIMIENTOS) {
    await prisma.procedimiento.upsert({
      where: { clinicaId_codigoCups: { clinicaId: clinica.id, codigoCups: proc.codigoCups } },
      update: {},
      create: { ...proc, clinicaId: clinica.id },
    });
  }

  await prisma.historiaClinica.upsert({
    where: { id: "historia-demo-firmada" },
    update: {},
    create: {
      id: "historia-demo-firmada",
      clinicaId: clinica.id,
      pacienteId: "paciente-demo-1",
      profesionalId: profesional.id,
      fechaAtencion: haceDias(6),
      finalidadConsulta: "Tratamiento",
      motivoConsulta: "Dolor en molar inferior derecho de 3 días de evolución, sensible al frío.",
      enfermedadActual: "Paciente refiere dolor moderado provocado, cede al retirar el estímulo.",
      antecedentesPersonales: "Sin antecedentes médicos relevantes. No alergias conocidas.",
      antecedentesOdontologicos: "Última consulta hace 2 años. Sin tratamientos de conducto previos.",
      examenExtraoral: "Sin alteraciones a la palpación ganglionar ni muscular.",
      examenIntraoral: "Lesión cariosa profunda en cara oclusal de 46, sensible a la percusión leve.",
      odontogramaJson: JSON.stringify({ 46: "caries", 36: "obturado", 16: "corona" }),
      diagnosticosJson: JSON.stringify([{ codigo: "K04.0 Pulpitis", diente: "46" }]),
      planTratamientoJson: JSON.stringify([
        { procedimiento: "232135 Obturación resina", diente: "46", prioridad: "Alta" },
      ]),
      procedimientosRealizadosJson: JSON.stringify([
        { cups: "232135 Obturación resina", diente: "46", valor: "130000" },
      ]),
      observaciones: "Procedimiento sin complicaciones. Buena tolerancia del paciente.",
      recomendaciones: "Evitar masticar del lado tratado por 24 horas. Control en 6 meses.",
      firmaProfesionalUrl: FIRMA_EJEMPLO,
      firmadaEn: haceDias(6),
      bloqueada: true,
    },
  });

  await prisma.historiaClinica.upsert({
    where: { id: "historia-demo-borrador" },
    update: {},
    create: {
      id: "historia-demo-borrador",
      clinicaId: clinica.id,
      pacienteId: "paciente-demo-2",
      profesionalId: profesional.id,
      fechaAtencion: haceDias(1),
      finalidadConsulta: "Diagnóstico",
      motivoConsulta: "Control de rutina y limpieza.",
      examenIntraoral: "Placa bacteriana leve generalizada. Sin lesiones cariosas visibles.",
      odontogramaJson: JSON.stringify({ 26: "ausente" }),
      diagnosticosJson: JSON.stringify([{ codigo: "Z01.2 Examen odontológico", diente: "" }]),
    },
  });

  await prisma.consentimientoInformado.upsert({
    where: { id: "consentimiento-demo-firmado" },
    update: {},
    create: {
      id: "consentimiento-demo-firmado",
      pacienteId: "paciente-demo-1",
      titulo: "Consentimiento informado — Obturación con resina",
      contenido:
        "Declaro haber sido informada de forma clara sobre el procedimiento de obturación con resina en el diente 46, sus riesgos, beneficios y alternativas, de conformidad con la Resolución 3100 de 2019 y la Ley 23 de 1981.",
      estado: "FIRMADO",
      firmaPacienteBase64: FIRMA_EJEMPLO,
      firmadoEn: haceDias(6),
      dispositivo: "Dispositivo del consultorio (demo)",
    },
  });

  await prisma.consentimientoInformado.upsert({
    where: { id: "consentimiento-demo-pendiente" },
    update: {},
    create: {
      id: "consentimiento-demo-pendiente",
      pacienteId: "paciente-demo-3",
      titulo: "Consentimiento informado — Atención odontológica general",
      contenido:
        "Autorizo al equipo odontológico a realizar la valoración y los procedimientos descritos, así como el tratamiento de mis datos personales conforme a la Ley 1581 de 2012.",
      estado: "PENDIENTE",
    },
  });

  await prisma.factura.upsert({
    where: { clinicaId_numero: { clinicaId: clinica.id, numero: "000001" } },
    update: {},
    create: {
      clinicaId: clinica.id,
      pacienteId: "paciente-demo-1",
      numero: "000001",
      itemsJson: JSON.stringify([
        { descripcion: "Obturación resina en diente unirradicular", cups: "232135", cantidad: 1, valorUnitario: 130000 },
      ]),
      subtotal: 130000,
      descuento: 0,
      total: 130000,
      estado: "PAGADA",
      metodoPago: "Transferencia",
    },
  });

  await prisma.factura.upsert({
    where: { clinicaId_numero: { clinicaId: clinica.id, numero: "000002" } },
    update: {},
    create: {
      clinicaId: clinica.id,
      pacienteId: "paciente-demo-2",
      numero: "000002",
      itemsJson: JSON.stringify([
        { descripcion: "Consulta de primera vez odontología general", cups: "997211", cantidad: 1, valorUnitario: 65000 },
        { descripcion: "Profilaxis y control de placa bacteriana", cups: "997511", cantidad: 1, valorUnitario: 85000 },
      ]),
      subtotal: 150000,
      descuento: 10000,
      total: 140000,
      estado: "EMITIDA",
      metodoPago: "Efectivo",
    },
  });

  const citas = [
    { id: "cita-demo-1", pacienteId: "paciente-demo-2", horasDesdeAhora: 3, motivo: "Control de limpieza" },
    { id: "cita-demo-2", pacienteId: "paciente-demo-3", horasDesdeAhora: 26, motivo: "Valoración ortodoncia" },
    { id: "cita-demo-3", pacienteId: "paciente-demo-1", horasDesdeAhora: -20, motivo: "Obturación resina" },
  ];
  for (const c of citas) {
    const fechaHora = enHoras(c.horasDesdeAhora);
    await prisma.cita.upsert({
      where: { id: c.id },
      update: { fechaHora },
      create: {
        id: c.id,
        clinicaId: clinica.id,
        pacienteId: c.pacienteId,
        profesionalId: profesional.id,
        fechaHora,
        motivo: c.motivo,
        estado: c.horasDesdeAhora < 0 ? "ATENDIDA" : "PROGRAMADA",
      },
    });
  }

  return { clinica: clinica.nombre };
}
