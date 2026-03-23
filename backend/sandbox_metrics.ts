import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testMetrics() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    console.log("1. Demographics...");
    const totalInvestors = await prisma.profiles.count({ where: { role: 'FUNDER', is_frozen: false } });
    
    console.log("2. Portfolios...");
    const portfolios = await prisma.investorPortfolios.aggregate({ _sum: { investment_amount: true } });
    
    console.log("3. Collections...");
    const collections = await prisma.agentCollections.aggregate({
      where: { created_at: { startsWith: today } },
      _sum: { amount: true }
    });
    
    console.log("4. Operations...");
    const activeAgents = await prisma.profiles.count({ where: { role: 'AGENT', is_frozen: false } });
    const visits = await prisma.agentVisits.count({ where: { created_at: { startsWith: today } } });
    
    console.log("5. Risks...");
    const disbursedRequests = await prisma.rentRequests.findMany({ where: { status: 'DISBURSED' } });
    
    console.log("6. Withdrawals...");
    const pendingWithdrawalsSum = await prisma.investmentWithdrawalRequests.aggregate({
      where: { status: 'manager_approved' },
      _sum: { amount: true }
    });
    
    console.log("7. Walles...");
    const wallets = await prisma.wallets.aggregate({ _sum: { balance: true }});
    
    console.log("SUCCESS!");
  } catch (error) {
    console.error("CRASHED WITH ERROR:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testMetrics();
