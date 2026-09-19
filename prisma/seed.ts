import { PrismaClient } from "@prisma/client";
import { seedDatabase } from "../src/lib/seed/run-seed";
import { seedDemoSandbox } from "../src/lib/demo/seed-sandbox";

const prisma = new PrismaClient();

async function main() {
  const principal = await seedDatabase(prisma);
  const sandbox = await seedDemoSandbox(prisma);
  console.log("Seed completo:", { ...principal, adminPassword: "BioDentis2026*", sandbox: sandbox.clinica });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
