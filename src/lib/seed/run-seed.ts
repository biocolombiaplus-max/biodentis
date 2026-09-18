import { PrismaClient, RolUsuario, TipoDocumento, RegimenAfiliacion } from "@prisma/client";
import bcrypt from "bcryptjs";

const PLANES = [
  {
    codigo: "basico",
    nombre: "Básico",
    descripcion: "Para el consultorio de un solo odontólogo que quiere dejar el papel atrás.",
    precioMensual: 89000,
    precioAnual: 890000,
    destacado: false,
    orden: 1,
    limiteUsuarios: 1,
    limitePacientes: 300,
    caracteristicas: JSON.stringify([
      "1 usuario / 1 silla odontológica",
      "Hasta 300 pacientes activos",
      "Agenda de citas con recordatorios",
      "Historia clínica digital (Resolución 3100)",
      "Odontograma interactivo",
      "Consentimientos informados con firma en pantalla",
      "Respaldo automático diario",
      "Soporte por WhatsApp en horario hábil",
    ]),
  },
  {
    codigo: "profesional",
    nombre: "Profesional",
    descripcion: "El plan más elegido: automatiza la parte administrativa y clínica de consultorios en crecimiento.",
    precioMensual: 179000,
    precioAnual: 1790000,
    destacado: true,
    orden: 2,
    limiteUsuarios: 3,
    limitePacientes: 1500,
    caracteristicas: JSON.stringify([
      "Hasta 3 usuarios / sillas",
      "Hasta 1.500 pacientes activos",
      "Todo lo del plan Básico",
      "Facturación electrónica (habilitada DIAN)",
      "Generación automática de archivos RIPS",
      "Firma remota de consentimientos por enlace o WhatsApp",
      "Asistente de IA: sugerencia de CIE-10 y apoyo en evolución",
      "Recordatorios de citas por WhatsApp",
      "Reportes de productividad por profesional",
      "Soporte prioritario",
    ]),
  },
  {
    codigo: "clinica",
    nombre: "Clínica",
    descripcion: "Para clínicas con varios consultorios, sedes o especialidades.",
    precioMensual: 349000,
    precioAnual: 3490000,
    destacado: false,
    orden: 3,
    limiteUsuarios: 8,
    limitePacientes: 5000,
    caracteristicas: JSON.stringify([
      "Hasta 8 usuarios / varias sedes",
      "Hasta 5.000 pacientes activos",
      "Todo lo del plan Profesional",
      "Interoperabilidad de historia clínica (HL7 FHIR)",
      "IA avanzada: redacción asistida y alertas clínicas",
      "Roles y permisos avanzados por sede",
      "Reportes gerenciales e indicadores de gestión",
      "Onboarding guiado y migración de datos",
      "Soporte prioritario con gestor de cuenta",
    ]),
  },
  {
    codigo: "enterprise",
    nombre: "Red de Clínicas",
    descripcion: "Para redes, IPS y grupos odontológicos con necesidades a la medida.",
    precioMensual: 0,
    precioAnual: 0,
    destacado: false,
    orden: 4,
    limiteUsuarios: null,
    limitePacientes: null,
    caracteristicas: JSON.stringify([
      "Usuarios y sedes ilimitados",
      "Todo lo del plan Clínica",
      "Integraciones a la medida (EPS, IPS en red, ERP)",
      "SLA y soporte dedicado",
      "Contrato y facturación empresarial",
      "Precio a la medida: contáctanos",
    ]),
  },
];

const SECCIONES = [
  { clave: "hero", orden: 1, titulo: "El software que tu consultorio odontológico necesita", subtitulo: "Historia clínica, agenda, consentimientos, facturación y RIPS en un solo lugar, con IA que te guía en cada paso." },
  { clave: "confianza", orden: 2, titulo: "Cumplimiento normativo desde el primer día", subtitulo: "Diseñado con la Resolución 3100 de 2019, la Ley 1581 de Habeas Data y la normativa RIPS vigente." },
  { clave: "beneficios", orden: 3, titulo: "Todo lo que tu consultorio necesita, en un solo software", subtitulo: "Administra lo clínico y lo administrativo sin perder tiempo ni cumplimiento." },
  { clave: "como_funciona", orden: 4, titulo: "Empieza a usarlo en menos de un día", subtitulo: "Sin instalaciones complejas ni curva de aprendizaje eterna." },
  { clave: "ia", orden: 5, titulo: "Inteligencia artificial que trabaja contigo", subtitulo: "Tu asistente clínico y administrativo, disponible siempre." },
  { clave: "personalizacion", orden: 6, titulo: "Tu marca, tu consultorio, tu identidad", subtitulo: "Personaliza logo, colores e imágenes sin depender de un programador." },
  { clave: "planes", orden: 7, titulo: "Planes para cada tamaño de consultorio", subtitulo: "Empieza pequeño y crece sin cambiar de sistema." },
  { clave: "testimonios", orden: 8, titulo: "Consultorios que ya confían en BioDentis", subtitulo: "" },
  { clave: "faq", orden: 9, titulo: "Preguntas frecuentes", subtitulo: "" },
  { clave: "cta_final", orden: 10, titulo: "Moderniza tu consultorio hoy", subtitulo: "Agenda una demo y descubre cómo BioDentis simplifica tu día a día." },
];

export async function seedDatabase(prisma: PrismaClient) {
  for (const p of PLANES) {
    await prisma.plan.upsert({
      where: { codigo: p.codigo },
      update: p,
      create: p,
    });
  }

  const planProfesional = await prisma.plan.findUniqueOrThrow({ where: { codigo: "profesional" } });

  const clinica = await prisma.clinica.upsert({
    where: { id: "clinica-demo" },
    update: {},
    create: {
      id: "clinica-demo",
      nombre: "Consultorio Odontológico Sonrisa Sana",
      nit: "900123456-1",
      slogan: "Cuidamos tu sonrisa con calidez humana",
      telefono: "(601) 555 0101",
      whatsapp: "573001234567",
      email: "contacto@sonrisasana.com.co",
      direccion: "Calle 100 # 15-20, Consultorio 302",
      ciudad: "Bogotá D.C.",
      colorPrimario: "#D6006E",
      colorSecundario: "#FF4FA0",
      colorAcento: "#1B1035",
      planId: planProfesional.id,
    },
  });

  for (const s of SECCIONES) {
    await prisma.seccionLanding.upsert({
      where: { clinicaId_clave: { clinicaId: clinica.id, clave: s.clave } },
      update: {},
      create: { ...s, clinicaId: clinica.id },
    });
  }

  const passwordHash = await bcrypt.hash("BioDentis2026*", 10);
  await prisma.usuario.upsert({
    where: { email: "admin@sonrisasana.com.co" },
    update: {},
    create: {
      clinicaId: clinica.id,
      nombre: "Dra. Camila Rojas",
      email: "admin@sonrisasana.com.co",
      passwordHash,
      rol: RolUsuario.ADMIN,
      registroProfesional: "RETHUS-1029384756",
    },
  });

  const PROCEDIMIENTOS = [
    { codigoCups: "997211", nombre: "Consulta de primera vez odontología general", valor: 60000 },
    { codigoCups: "997511", nombre: "Profilaxis y control de placa bacteriana", valor: 80000 },
    { codigoCups: "232135", nombre: "Obturación resina en diente unirradicular", valor: 120000 },
    { codigoCups: "232541", nombre: "Exodoncia diente permanente uniradicular", valor: 150000 },
    { codigoCups: "230130", nombre: "Blanqueamiento dental ambulatorio", valor: 350000 },
  ];
  for (const proc of PROCEDIMIENTOS) {
    await prisma.procedimiento.upsert({
      where: { clinicaId_codigoCups: { clinicaId: clinica.id, codigoCups: proc.codigoCups } },
      update: {},
      create: { ...proc, clinicaId: clinica.id },
    });
  }

  const paciente = await prisma.paciente.upsert({
    where: {
      clinicaId_tipoDocumento_numeroDocumento: {
        clinicaId: clinica.id,
        tipoDocumento: TipoDocumento.CC,
        numeroDocumento: "1020304050",
      },
    },
    update: {},
    create: {
      clinicaId: clinica.id,
      tipoDocumento: TipoDocumento.CC,
      numeroDocumento: "1020304050",
      primerNombre: "Laura",
      segundoNombre: "Valentina",
      primerApellido: "García",
      segundoApellido: "Pérez",
      fechaNacimiento: new Date("1994-06-12"),
      sexo: "F",
      regimenAfiliacion: RegimenAfiliacion.CONTRIBUTIVO,
      eps: "Nueva EPS",
      zonaResidencia: "U",
      departamento: "Bogotá D.C.",
      municipio: "Bogotá",
      direccion: "Cra 45 # 22-10",
      celular: "3012223344",
      email: "laura.garcia@example.com",
      habeasDataAceptado: true,
    },
  });

  await prisma.plantillaConsentimiento.upsert({
    where: { id: "plantilla-general" },
    update: {},
    create: {
      id: "plantilla-general",
      clinicaId: clinica.id,
      nombre: "Consentimiento informado general de atención odontológica",
      contenido:
        "Yo, el/la paciente (o su representante legal), declaro que he sido informado(a) de forma clara y suficiente sobre el procedimiento odontológico a realizar, sus riesgos, beneficios, alternativas y las consecuencias de no realizarlo, de conformidad con la Resolución 3100 de 2019 y la Ley 23 de 1981. Autorizo al equipo odontológico a realizar el procedimiento descrito y el tratamiento de mis datos personales conforme a la Ley 1581 de 2012.",
      activo: true,
    },
  });

  const TESTIMONIOS = [
    {
      nombre: "Dra. A. Martínez",
      cargo: "Odontóloga general, Bogotá",
      texto:
        "Dejamos las historias en papel por completo. Ahora el odontograma, los consentimientos y la agenda quedan en un solo lugar y el RIPS se genera solo cada mes.",
      orden: 1,
    },
    {
      nombre: "Dr. J. Ramírez",
      cargo: "Consultorio de ortodoncia, Medellín",
      texto:
        "La firma de consentimientos por enlace nos ahorra tiempo con pacientes que llegan de afán. El asistente de IA ayuda mucho a mis auxiliares nuevas.",
      orden: 2,
    },
    {
      nombre: "Dra. P. Gómez",
      cargo: "Clínica odontológica familiar, Cali",
      texto:
        "Personalizamos el sistema con nuestros colores y logo en minutos. Se ve como si lo hubiéramos mandado a hacer a la medida.",
      orden: 3,
    },
  ];
  for (const t of TESTIMONIOS) {
    await prisma.testimonio.upsert({
      where: { id: `testimonio-${t.orden}` },
      update: {},
      create: { id: `testimonio-${t.orden}`, clinicaId: clinica.id, ...t },
    });
  }

  return {
    clinica: clinica.nombre,
    paciente: paciente.primerNombre,
    adminEmail: "admin@sonrisasana.com.co",
  };
}
