import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('@Margie11', 10);
  await prisma.$executeRawUnsafe(`
    INSERT INTO profiles (id, phone, full_name, password_hash, role) 
    VALUES ('acc-1234', '0704825473', 'Margie', '${hash}', 'TENANT') 
    ON CONFLICT (phone) DO UPDATE SET password_hash = '${hash}'
  `);
  console.log('Successfully Seeded via raw query!');
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
