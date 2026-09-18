import { PrismaClient } from "@prisma/client";
import { seedDatabase } from "../src/lib/seed/run-seed";

const prisma = new PrismaClient();

seedDatabase(prisma)
  .then((resultado) => {
    console.log("Seed completo:", { ...resultado, adminPassword: "BioDentis2026*" });
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
