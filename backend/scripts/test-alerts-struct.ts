import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const event = await prisma.systemEvents.findFirst();
  console.log(JSON.stringify(event, null, 2));
}

main().finally(() => prisma.$disconnect());
