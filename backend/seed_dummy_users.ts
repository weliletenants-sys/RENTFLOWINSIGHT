import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const timestamp = new Date().toISOString();
  
  // Default password "123456"
  const passwordHash = await bcrypt.hash('123456', 10);

  const dummyUsers = [
    { phone: '0700000001', name: 'Mock Tenant', role: 'TENANT' },
    { phone: '0700000002', name: 'Mock Agent', role: 'AGENT' },
    { phone: '0700000003', name: 'Mock Landlord', role: 'LANDLORD' }
  ];

  for (const u of dummyUsers) {
     const exists = await prisma.profiles.findUnique({ where: { phone: u.phone } });
     
     if (!exists) {
        const user = await prisma.profiles.create({
           data: {
             full_name: u.name,
             phone: u.phone,
             role: u.role,
             password_hash: passwordHash,
             created_at: timestamp,
             updated_at: timestamp,
             is_frozen: false,
             rent_discount_active: false,
             verified: true,
             kyc_status: 'APPROVED'
           }
        });
        
        // Ensure they have a universal wallet
        await prisma.wallets.create({
           data: {
             balance: 500000, 
             created_at: timestamp,
             updated_at: timestamp,
             user_id: user.id
           }
        });

        // Ensure roles assignment for profile switcher
        await prisma.userRoles.create({
           data: {
               role: u.role,
               created_at: timestamp,
               enabled: true,
               user_id: user.id
           }
        });

        console.log(`Created ${u.role}: Phone ${u.phone} | Password: "123456" | Wallet: 500,000 UGX`);
     } else {
        console.log(`${u.role} already exists (${u.phone}). Re-syncing wallet / roles if needed.`);
     }
  }

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
