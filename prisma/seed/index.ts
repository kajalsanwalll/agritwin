import { PrismaClient } from "../../app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log(" Seeding AgriTwin database...");

  // Create tomato crop profile
  const tomato = await prisma.cropProfile.upsert({
    where: {
      name: "Tomato",
    },
    update: {},
    create: {
      name: "Tomato",

      minTemperature: 20,
      maxTemperature: 30,

      minHumidity: 60,
      maxHumidity: 70,

      minSoilMoisture: 40,
      maxSoilMoisture: 60,
    },
  });

  // Create our first virtual polyhouse
  const polyhouse = await prisma.polyhouse.upsert({
    where: {
      id: "polyhouse-a",
    },
    update: {},
    create: {
      id: "polyhouse-a",
      name: "Polyhouse A",
      location: "Zone A",
      cropProfileId: tomato.id,
    },
  });

  // Create an initial sensor reading
  await prisma.sensorReading.create({
    data: {
      polyhouseId: polyhouse.id,

      temperature: 27.5,
      humidity: 64,
      soilMoisture: 48,
      lightIntensity: 62000,
      co2: 420,
    },
  });

  console.log(" Tomato profile created");
  console.log(" Polyhouse A created");
  console.log(" Initial sensor reading created");
}

main()
  .catch((error) => {
    console.error(" Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });