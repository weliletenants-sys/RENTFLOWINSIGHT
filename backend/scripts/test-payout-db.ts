import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Testing PayoutMethods.create()...');
  try {
    const res = await prisma.payoutMethods.create({
      data: {
        user_id: "test-user-id",
        provider: "MTN Mobile Money",
        account_name: "John Doe",
        account_number: "0770000000",
        is_primary: true
      }
    });
    console.log('Success:', res);
    
    // Clean up
    await prisma.payoutMethods.delete({ where: { id: res.id } });
  } catch (err: any) {
    console.error('Prisma Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
