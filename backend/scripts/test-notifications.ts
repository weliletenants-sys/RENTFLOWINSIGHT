import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const notifs = await prisma.notifications.findMany({ take: 5 });
  console.log('Sample Notifications:');
  notifs.forEach(n => console.log(`ID: ${n.id}, user: ${n.user_id}, read: ${n.is_read}`));

  if (notifs.length > 0) {
    const target = notifs[0];
    console.log(`\nMarking ID ${target.id} as read...`);
    const updated = await prisma.notifications.update({
      where: { id: target.id },
      data: { is_read: true }
    });
    console.log(`Updated successfully: read=${updated.is_read}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
