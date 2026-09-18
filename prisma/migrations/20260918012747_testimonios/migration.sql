-- CreateTable
CREATE TABLE "Testimonio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clinicaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cargo" TEXT,
    "texto" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Testimonio_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
