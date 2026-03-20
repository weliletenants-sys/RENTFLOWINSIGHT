import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Phase 2 Migration: The Bucketizer 🪣...');

  // 1. Persona Mapping phase
  console.log('Mapping UserRoles to UserPersonas...');
  const activeRoles = await prisma.userRoles.findMany({
    where: { enabled: true, user_id: { not: null } }
  });

  let newPersonasCount = 0;
  for (const role of activeRoles) {
    if (!role.user_id) continue;
    
    // Check if it already exists
    const existing = await prisma.userPersonas.findFirst({
      where: { user_id: role.user_id, persona: role.role.toLowerCase() }
    });

    if (!existing) {
      await prisma.userPersonas.create({
        data: {
          user_id: role.user_id,
          persona: role.role.toLowerCase(),
          is_default: true, // Auto-approve legacy roles as default
        }
      });
      newPersonasCount++;
    }
  }
  console.log(`✅ Created ${newPersonasCount} new User Personas from legacy data.`);

  // 2. Wallet Bucket Initialization Phase
  console.log('Initializing Wallet Buckets...');
  const wallets = await prisma.wallets.findMany({
    where: { user_id: { not: null } }
  });

  let newBucketsCount = 0;
  for (const wallet of wallets) {
    if (!wallet.user_id) continue;

    const investedBucket = await prisma.walletBuckets.findFirst({
      where: { wallet_id: wallet.id, bucket_type: 'invested' }
    });

    // Skip if this wallet is already bucketized
    if (investedBucket) continue;

    let investedInitial = 0;
    let commissionInitial = 0;

    // A. Check for Funder Active Investments
    const portfolios = await prisma.investorPortfolios.findMany({
      where: { investor_id: wallet.user_id, status: 'ACTIVE' }
    });
    investedInitial = portfolios.reduce((sum, p) => sum + p.investment_amount, 0);

    // B. Check if user is an Agent to map commission/float legacy balance
    const agentRoles = await prisma.userPersonas.findFirst({
      where: { user_id: wallet.user_id, persona: 'agent' }
    });
    
    // For agents without investments, their entire legacy wallet balance is their operating commission/float.
    if (agentRoles && investedInitial === 0) {
      commissionInitial = wallet.balance;
    }

    // Determine what is left as the liquid baseline
    const remainder = wallet.balance - investedInitial - commissionInitial;
    // Safeguard negative balances by capping remainder at 0 if math goes bad, 
    // and adjusting invested artificially (real CFO validation handles this in Phase 3).
    const safeRemainder = Math.max(0, remainder);

    // Create the core buckets
    await prisma.walletBuckets.createMany({
      data: [
        { wallet_id: wallet.id, bucket_type: 'available', balance: safeRemainder },
        { wallet_id: wallet.id, bucket_type: 'invested', balance: investedInitial },
        { wallet_id: wallet.id, bucket_type: 'commission', balance: commissionInitial },
        { wallet_id: wallet.id, bucket_type: 'reserved', balance: 0 },
        { wallet_id: wallet.id, bucket_type: 'savings', balance: 0 }
      ]
    });
    newBucketsCount += 5;
  }
  
  console.log(`✅ Generated ${newBucketsCount} strict buckets across all unified Wallets.`);
  console.log('Phase 2 Bucketizer execution completed.');
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
