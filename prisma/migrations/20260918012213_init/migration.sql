-- CreateTable
CREATE TABLE "Clinica" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Clinica_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SeccionLanding" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clinicaId" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "titulo" TEXT,
    "subtitulo" TEXT,
    "imagenFondoUrl" TEXT,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "SeccionLanding_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "activo" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clinicaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'ODONTOLOGO',
    "registroProfesional" TEXT,
    "firmaUrl" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Usuario_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clinicaId" TEXT NOT NULL,
    "tipoDocumento" TEXT NOT NULL,
    "numeroDocumento" TEXT NOT NULL,
    "primerNombre" TEXT NOT NULL,
    "segundoNombre" TEXT,
    "primerApellido" TEXT NOT NULL,
    "segundoApellido" TEXT,
    "fechaNacimiento" DATETIME NOT NULL,
    "sexo" TEXT NOT NULL,
    "genero" TEXT,
    "regimenAfiliacion" TEXT NOT NULL DEFAULT 'PARTICULAR',
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Paciente_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HistoriaClinica" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clinicaId" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "profesionalId" TEXT NOT NULL,
    "fechaAtencion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    "proximoControl" DATETIME,
    "firmaProfesionalUrl" TEXT,
    "firmadaEn" DATETIME,
    "bloqueada" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HistoriaClinica_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HistoriaClinica_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlantillaConsentimiento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clinicaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "procedimiento" TEXT,
    "contenido" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlantillaConsentimiento_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConsentimientoInformado" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pacienteId" TEXT NOT NULL,
    "plantillaId" TEXT,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "tokenFirmaRemota" TEXT,
    "firmaPacienteBase64" TEXT,
    "firmaTestigoBase64" TEXT,
    "nombreTestigo" TEXT,
    "ip" TEXT,
    "dispositivo" TEXT,
    "enviadoEn" DATETIME,
    "firmadoEn" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ConsentimientoInformado_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ConsentimientoInformado_plantillaId_fkey" FOREIGN KEY ("plantillaId") REFERENCES "PlantillaConsentimiento" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Procedimiento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clinicaId" TEXT NOT NULL,
    "codigoCups" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Procedimiento_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cita" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clinicaId" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "profesionalId" TEXT NOT NULL,
    "fechaHora" DATETIME NOT NULL,
    "duracionMin" INTEGER NOT NULL DEFAULT 30,
    "motivo" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'PROGRAMADA',
    "notas" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Cita_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Cita_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Cita_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Factura" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clinicaId" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "itemsJson" TEXT NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "descuento" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'BORRADOR',
    "metodoPago" TEXT,
    "cufe" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Factura_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Factura_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RipsExport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clinicaId" TEXT NOT NULL,
    "periodoInicio" DATETIME NOT NULL,
    "periodoFin" DATETIME NOT NULL,
    "tipo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "totalRegistros" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RipsExport_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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
