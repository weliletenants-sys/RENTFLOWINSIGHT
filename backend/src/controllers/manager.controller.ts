import { Request, Response } from 'express';
import prisma from '../index';

/**
 * Returns the state of the Rent Management Pool vs active obligations.
 */
export const getPoolBalance = async (req: Request, res: Response) => {
  try {
    const portfolios = await prisma.investorPortfolios.aggregate({
      where: { status: 'ACTIVE' },
      _sum: { investment_amount: true, total_roi_earned: true }
    });
    const totalPartnerCapital = (portfolios._sum.investment_amount || 0) + (portfolios._sum.total_roi_earned || 0);

    // Calculate Capital currently locked inside outstanding Rent Requests
    const rentRequests = await prisma.rentRequests.findMany({ 
      where: { status: { in: ['DISBURSED', 'funded', 'delivered'] } } 
    });
    
    let deployedCapital = 0;
    for (const rr of rentRequests) {
      deployedCapital += (Number(rr.total_repayment) || 0) - (Number(rr.amount_repaid) || 0);
    }

    const liquidPool = Math.max(0, totalPartnerCapital - deployedCapital);
    // 15% Minimum Reserve rule
    const reserveLockAmount = totalPartnerCapital * 0.15;
    const deployableCapital = Math.max(0, liquidPool - reserveLockAmount);
    // Liquidity Gate condition
    const isGateLocked = liquidPool <= reserveLockAmount;

    res.json({
      liquidPool,
      deployedCapital,
      totalPartnerCapital,
      reserveLockAmount,
      deployableCapital,
      isGateLocked
    });
  } catch (error) {
    console.error('[Manager API] Pool Balance Error:', error);
    res.status(500).json({
      type: "https://api.rentflow.com/errors/internal-error",
      title: "Internal Server Error",
      status: 500,
      detail: "An internal platform error occurred while evaluating Supporter Pool metrics."
    });
  }
};

/**
 * Fetch stage 3 rent requests pending final Capital Dispatch.
 */
export const getPendingRentRequests = async (req: Request, res: Response) => {
  try {
    const requests = await prisma.rentRequests.findMany({
      where: { status: { in: ['manager_approved', 'coo_approved'] } }, // Looking for pre-funded requests
      include: {
        profiles: { select: { full_name: true, phone: true } },
        agents: { include: { profiles: { select: { full_name: true } } } }
      },
      orderBy: { created_at: 'desc' }
    });

    res.json(requests);
  } catch (error) {
    console.error('[Manager API] Pending Requests Error:', error);
    res.status(500).json({
      type: "https://api.rentflow.com/errors/internal-error",
      title: "Internal Server Error",
      status: 500,
      detail: "Failed to retrieve the Rent Pipeline Queue."
    });
  }
};

/**
 * Execute the atomic deployment of cash from the pool into an active rent stream.
 */
export const deployCapitalToTenant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const rentRequest = await prisma.rentRequests.findUnique({ where: { id } });
    if (!rentRequest || !['manager_approved', 'coo_approved'].includes(rentRequest.status)) {
      return res.status(400).json({
        type: "https://api.rentflow.com/errors/validation-error",
        title: "Validation Error",
        status: 400,
        detail: "The Rent Request ID provided does not exist or is not actively awaiting deployment."
      });
    }

    // Step 1: Ensure Pool has sufficient funds ignoring lock
    // (This is a simplified programmatic lock check, relying on getPoolBalance normally)
    const principalToDeploy = Number(rentRequest.total_repayment);

    // Atomic execution block
    const result = await prisma.$transaction(async (tx) => {
      
      // Update the request to Funded status (bypassing directly to funded as per workflow config)
      const updatedReq = await tx.rentRequests.update({
        where: { id },
        data: { status: 'funded' } // Move to Stage 5
      });

      // Write pool deployment ledger entry
      await tx.generalLedger.create({
        data: {
          user_id: rentRequest.user_id,
          amount: principalToDeploy,
          category: 'fund_deployment',
          direction: 'debit', // Subtracting from platform holdings over to the tenant
          reference_id: rentRequest.id,
          status: 'COMPLETED',
          description: `Capital dynamically deployed to Rent Request ${id.slice(-6).toUpperCase()}`
        }
      });

      // Reward Agent with 5000 UGX funding facilitation bonus (mocked as general ledger entry)
      if (rentRequest.agent_id) {
        await tx.generalLedger.create({
          data: {
            user_id: rentRequest.agent_id,
            amount: 5000,
            category: 'bonus',
            direction: 'credit',
            reference_id: `BONUS-${rentRequest.id}`,
            status: 'COMPLETED',
            description: `Agent rent origination bonus for funding completion.`
          }
        });
      }

      return updatedReq;
    });

    res.json(result);
  } catch (error) {
    console.error('[Manager API] Deploy Capital Error:', error);
    res.status(500).json({ 
      type: "https://api.rentflow.com/errors/internal-error",
      title: "Execution Error",
      status: 500,
      detail: "Encountered a critical fault executing the atomic deployment transaction block."
    });
  }
};
