import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});
const prisma = new PrismaClient({ adapter });



async function main() {
  await prisma.deal.createMany({
    data: [
      {
        title: 'Luxury Sydney Weekend Escape',
        destination: 'Sydney, NSW',
        currency: 'AUD',
      },
      {
        title: 'Melbourne Food & Wine Getaway',
        destination: 'Melbourne, VIC',
        currency: 'AUD',
      },
      {
        title: 'Bali Resort + Spa Package',
        destination: 'Bali, Indonesia',
        currency: 'AUD',
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
