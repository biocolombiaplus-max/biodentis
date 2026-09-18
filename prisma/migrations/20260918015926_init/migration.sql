-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'ODONTOLOGO', 'AUXILIAR', 'RECEPCION');

-- CreateEnum
CREATE TYPE "EstadoConsentimiento" AS ENUM ('PENDIENTE', 'ENVIADO', 'FIRMADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "EstadoCita" AS ENUM ('PROGRAMADA', 'CONFIRMADA', 'ATENDIDA', 'CANCELADA', 'NO_ASISTIO');

-- CreateEnum
CREATE TYPE "EstadoFactura" AS ENUM ('BORRADOR', 'EMITIDA', 'PAGADA', 'ANULADA');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('RC', 'TI', 'CC', 'CE', 'PA', 'PEP', 'MS', 'AS', 'CN');

-- CreateEnum
CREATE TYPE "RegimenAfiliacion" AS ENUM ('CONTRIBUTIVO', 'SUBSIDIADO', 'ESPECIAL', 'EXCEPCION', 'PARTICULAR', 'NO_ASEGURADO');

-- CreateTable
CREATE TABLE "Clinica" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "nit" TEXT,
    "slogan" TEXT,
    "telefono" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "direccion" TEXT,
    "ciudad" TEXT,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "colorPrimario" TEXT NOT NULL DEFAULT '#D6006E',
    "colorSecundario" TEXT NOT NULL DEFAULT '#FF4FA0',
    "colorAcento" TEXT NOT NULL DEFAULT '#1B1035',
    "planId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clinica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonio" (
    "id" TEXT NOT NULL,
    "clinicaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cargo" TEXT,
    "texto" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Testimonio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeccionLanding" (
    "id" TEXT NOT NULL,
    "clinicaId" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "titulo" TEXT,
    "subtitulo" TEXT,
    "imagenFondoUrl" TEXT,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SeccionLanding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precioMensual" INTEGER NOT NULL,
    "precioAnual" INTEGER,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "limiteUsuarios" INTEGER,
    "limitePacientes" INTEGER,
    "caracteristicas" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "clinicaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL DEFAULT 'ODONTOLOGO',
    "registroProfesional" TEXT,
    "firmaUrl" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id" TEXT NOT NULL,
    "clinicaId" TEXT NOT NULL,
    "tipoDocumento" "TipoDocumento" NOT NULL,
    "numeroDocumento" TEXT NOT NULL,
    "primerNombre" TEXT NOT NULL,
    "segundoNombre" TEXT,
    "primerApellido" TEXT NOT NULL,
    "segundoApellido" TEXT,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "sexo" TEXT NOT NULL,
    "genero" TEXT,
    "regimenAfiliacion" "RegimenAfiliacion" NOT NULL DEFAULT 'PARTICULAR',
    "eps" TEXT,
    "zonaResidencia" TEXT,
    "paisResidencia" TEXT NOT NULL DEFAULT 'COLOMBIA',
    "departamento" TEXT,
    "municipio" TEXT,
    "direccion" TEXT,
    "telefono" TEXT,
    "celular" TEXT,
    "email" TEXT,
    "ocupacion" TEXT,
    "acudienteNombre" TEXT,
    "acudienteTelefono" TEXT,
    "grupoEtnico" TEXT,
    "discapacidad" TEXT,
    "habeasDataAceptado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoriaClinica" (
    "id" TEXT NOT NULL,
    "clinicaId" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "profesionalId" TEXT NOT NULL,
    "fechaAtencion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalidadConsulta" TEXT,
    "causaExterna" TEXT,
    "motivoConsulta" TEXT NOT NULL,
    "enfermedadActual" TEXT,
    "antecedentesPersonales" TEXT,
    "antecedentesFamiliares" TEXT,
    "antecedentesOdontologicos" TEXT,
    "signosVitalesJson" TEXT,
    "examenExtraoral" TEXT,
    "examenIntraoral" TEXT,
    "odontogramaJson" TEXT,
    "diagnosticosJson" TEXT,
    "planTratamientoJson" TEXT,
    "procedimientosRealizadosJson" TEXT,
    "observaciones" TEXT,
    "recomendaciones" TEXT,
    "proximoControl" TIMESTAMP(3),
    "firmaProfesionalUrl" TEXT,
    "firmadaEn" TIMESTAMP(3),
    "bloqueada" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistoriaClinica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantillaConsentimiento" (
    "id" TEXT NOT NULL,
    "clinicaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "procedimiento" TEXT,
    "contenido" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlantillaConsentimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentimientoInformado" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "plantillaId" TEXT,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "estado" "EstadoConsentimiento" NOT NULL DEFAULT 'PENDIENTE',
    "tokenFirmaRemota" TEXT,
    "firmaPacienteBase64" TEXT,
    "firmaTestigoBase64" TEXT,
    "nombreTestigo" TEXT,
    "ip" TEXT,
    "dispositivo" TEXT,
    "enviadoEn" TIMESTAMP(3),
    "firmadoEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsentimientoInformado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Procedimiento" (
    "id" TEXT NOT NULL,
    "clinicaId" TEXT NOT NULL,
    "codigoCups" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Procedimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cita" (
    "id" TEXT NOT NULL,
    "clinicaId" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "profesionalId" TEXT NOT NULL,
    "fechaHora" TIMESTAMP(3) NOT NULL,
    "duracionMin" INTEGER NOT NULL DEFAULT 30,
    "motivo" TEXT,
    "estado" "EstadoCita" NOT NULL DEFAULT 'PROGRAMADA',
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factura" (
    "id" TEXT NOT NULL,
    "clinicaId" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "itemsJson" TEXT NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "descuento" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL,
    "estado" "EstadoFactura" NOT NULL DEFAULT 'BORRADOR',
    "metodoPago" TEXT,
    "cufe" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Factura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RipsExport" (
    "id" TEXT NOT NULL,
    "clinicaId" TEXT NOT NULL,
    "periodoInicio" TIMESTAMP(3) NOT NULL,
    "periodoFin" TIMESTAMP(3) NOT NULL,
    "tipo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "totalRegistros" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RipsExport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SeccionLanding_clinicaId_clave_key" ON "SeccionLanding"("clinicaId", "clave");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_codigo_key" ON "Plan"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_clinicaId_tipoDocumento_numeroDocumento_key" ON "Paciente"("clinicaId", "tipoDocumento", "numeroDocumento");

-- CreateIndex
CREATE UNIQUE INDEX "ConsentimientoInformado_tokenFirmaRemota_key" ON "ConsentimientoInformado"("tokenFirmaRemota");

-- CreateIndex
CREATE UNIQUE INDEX "Procedimiento_clinicaId_codigoCups_key" ON "Procedimiento"("clinicaId", "codigoCups");

-- CreateIndex
CREATE UNIQUE INDEX "Factura_clinicaId_numero_key" ON "Factura"("clinicaId", "numero");

-- AddForeignKey
ALTER TABLE "Clinica" ADD CONSTRAINT "Clinica_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonio" ADD CONSTRAINT "Testimonio_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeccionLanding" ADD CONSTRAINT "SeccionLanding_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoriaClinica" ADD CONSTRAINT "HistoriaClinica_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoriaClinica" ADD CONSTRAINT "HistoriaClinica_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantillaConsentimiento" ADD CONSTRAINT "PlantillaConsentimiento_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentimientoInformado" ADD CONSTRAINT "ConsentimientoInformado_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentimientoInformado" ADD CONSTRAINT "ConsentimientoInformado_plantillaId_fkey" FOREIGN KEY ("plantillaId") REFERENCES "PlantillaConsentimiento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Procedimiento" ADD CONSTRAINT "Procedimiento_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RipsExport" ADD CONSTRAINT "RipsExport_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
