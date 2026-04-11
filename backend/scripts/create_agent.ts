import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const phone = '0700000000';
  const password = '123456';
  
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { phone }
  });
  
  if (existingUser) {
    console.log(`User ${phone} already exists. Updating password...`);
    await prisma.user.update({
      where: { phone },
      data: { password: hashedPassword, role: 'AGENT' }
    });
    console.log('Password updated and role set to AGENT.');
  } else {
    // Create new user
    await prisma.user.create({
      data: {
        phone,
        password: hashedPassword,
        firstName: 'Dummy',
        lastName: 'Agent',
        role: 'AGENT',
        verified: true,
        walletBalance: 0
      }
    });
    console.log(`Successfully created dummy agent ${phone}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
