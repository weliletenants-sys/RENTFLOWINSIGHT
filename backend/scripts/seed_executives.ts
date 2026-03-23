import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Executive Personas...');
  const passwordHash = await bcrypt.hash('Welile2026!', 10);

  const executives = [
    { email: 'superadmin@welile.com', role: 'SUPER_ADMIN', name: 'System Super Admin' },
    { email: 'ceo@welile.com', role: 'CEO', name: 'Chief Executive Officer' },
    { email: 'cfo@welile.com', role: 'CFO', name: 'Chief Financial Officer' },
    { email: 'coo@welile.com', role: 'COO', name: 'Chief Operating Officer' },
    { email: 'cto@welile.com', role: 'CTO', name: 'Chief Technology Officer' },
    { email: 'cmo@welile.com', role: 'CMO', name: 'Chief Marketing Officer' },
    { email: 'crm@welile.com', role: 'CRM', name: 'Customer Relations Mgr' },
    { email: 'admin@welile.com', role: 'ADMIN', name: 'General Platform Admin' }
  ];

  for (const exec of executives) {
    let profileId;
    const existing = await prisma.profiles.findFirst({ where: { email: exec.email } });
    
    if (existing) {
      await prisma.profiles.update({
        where: { id: existing.id },
        data: {
          role: exec.role,
          password_hash: passwordHash,
          full_name: exec.name
        }
      });
      profileId = existing.id;
      console.log(`[SEED] Updated Profile: ${exec.role} (${exec.email})`);
    } else {
      const created = await prisma.profiles.create({
        data: {
          email: exec.email,
          full_name: exec.name,
          phone: `+256700${Math.floor(100000 + Math.random() * 900000)}`,
          password_hash: passwordHash,
          role: exec.role,
          verified: true,
          is_frozen: false,
          rent_discount_active: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      });
      profileId = created.id;
      console.log(`[SEED] Created Profile: ${exec.role} (${exec.email})`);
    }

    // Forcefully inject the persona to fix the auth controller fallback bug
    const existingPersona = await prisma.userPersonas.findFirst({ 
      where: { user_id: profileId, persona: exec.role.toLowerCase() } 
    });

    if (!existingPersona) {
       await prisma.userPersonas.create({
         data: {
           user_id: profileId,
           persona: exec.role.toLowerCase(),
           is_default: true
         }
       });
       console.log(`[SEED] Injected Missing Persona: ${exec.role}`);
    } else {
       // Ensure only this one is default
       await prisma.userPersonas.updateMany({
         where: { user_id: profileId },
         data: { is_default: false }
       });
       await prisma.userPersonas.update({
         where: { id: existingPersona.id },
         data: { is_default: true }
       });
       console.log(`[SEED] Verified Persona: ${exec.role}`);
    }
  }

  console.log('Executive Seeding Complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
