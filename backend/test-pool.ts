import prisma from './src/prisma/prisma.client';

async function main() {
  try {
    const portfolios = await prisma.investorPortfolios.aggregate({
      where: { status: 'ACTIVE' },
      _sum: { investment_amount: true, total_roi_earned: true }
    });
    console.log(portfolios);

    const rentRequests = await prisma.rentRequests.findMany({ 
      where: { status: { in: ['DISBURSED', 'funded', 'delivered'] } } 
    });
    console.log(rentRequests.length);
  } catch (e) {
    console.error(e);
  }
}

main();
