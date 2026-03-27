import { Request, Response } from 'express';
import prisma from '../../prisma/prisma.client';
import { problemResponse } from '../../utils/problem';

/**
 * [GET] /api/v1/welile-homes/tenant/:tenant_id/dashboard
 * Retrieves the Gamification Dashboard Data for a Tenant.
 * Conforms to OpenAPI 3.1 specifications.
 */
export const getTenantGamificationDashboard = async (req: Request, res: Response) => {
  try {
    const { tenant_id } = req.params;

    // 1. Fetch Primary Gamification Record
    let gamification = await prisma.tenantGamification.findUnique({
      where: { tenant_id }
    });

    // Seed default if empty
    if (!gamification) {
      gamification = await prisma.tenantGamification.create({
        data: {
          tenant_id,
          target_goal: 50000000,
          current_savings: 0,
          payment_streak_months: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      });
    }

    // 2. Fetch Trophies
    let trophies = await prisma.gamificationTrophies.findMany({
      where: { tenant_id }
    });

    if (trophies.length === 0) {
      // Seed default trophies
      const defaultTrophies = [
         { tenant_id, title: 'Early Bird', description: 'First deposit', icon: '🥚', unlocked: false },
         { tenant_id, title: 'Consistent', description: '3 months streak', icon: '🔥', unlocked: false },
         { tenant_id, title: 'Halfway', description: '5% of goal', icon: '🎯', unlocked: false },
         { tenant_id, title: 'Investor', description: '10M UGX saved', icon: '💎', unlocked: false },
         { tenant_id, title: 'Master', description: 'Approved Loan', icon: '🏆', unlocked: false },
      ];
      await prisma.gamificationTrophies.createMany({ data: defaultTrophies });
      trophies = await prisma.gamificationTrophies.findMany({ where: { tenant_id } });
    }

    // 3. Fetch Savings History (Chart Data)
    let history = await prisma.savingsHistory.findMany({
      where: { tenant_id },
      orderBy: { id: 'asc' } // Placeholder ordering
    });

    if (history.length === 0) {
       const defaultHistory = [
          { tenant_id, month: 'Jan', savings: 500000, projected: 500000 },
          { tenant_id, month: 'Feb', savings: 1200000, projected: 1200000 },
          { tenant_id, month: 'Mar', savings: 2400000, projected: 2500000 },
          { tenant_id, month: 'Apr', savings: 3600000, projected: 4000000 },
          { tenant_id, month: 'May', savings: null, projected: 5500000 },
          { tenant_id, month: 'Jun', savings: null, projected: 7000000 },
       ];
       await prisma.savingsHistory.createMany({ data: defaultHistory });
       history = await prisma.savingsHistory.findMany({ where: { tenant_id } });
    }

    // Calculate dynamic Next Milestone based on current savings percent
    const progressPercent = Math.round((gamification.current_savings / gamification.target_goal) * 100);
    const nextMilestonePercentage = Math.ceil((progressPercent + 1) / 5) * 5; // next 5% boundary

    return res.status(200).json({
      target_goal: gamification.target_goal,
      current_savings: gamification.current_savings,
      payment_streak_months: gamification.payment_streak_months,
      next_milestone: {
        title: `${nextMilestonePercentage}% Deposit`,
        percentage: nextMilestonePercentage
      },
      trophies: trophies.map(t => ({
        id: t.id,
        title: t.title,
        desc: t.description,
        icon: t.icon,
        unlocked: t.unlocked
      })),
      historical_data: history.map(h => ({
        month: h.month,
        savings: h.savings,
        projected: h.projected
      }))
    });

  } catch (error: any) {
    console.error('[Tenant Gamification Dashboard Error]', error.message);
    return problemResponse(res, 500, 'Internal Server Error', 'Engine failed calculating gamification dashboard metrics.', 'internal-server-error');
  }
};

/**
 * [POST] /api/v1/welile-homes/tenant/:tenant_id/deposit
 * Submits a deposit to Gamification Savings.
 * Conforms to OpenAPI 3.1 specifications.
 */
export const depositTenantSavings = async (req: Request, res: Response) => {
  try {
    const { tenant_id } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return problemResponse(res, 422, 'Validation Error', 'Deposit amount must be greater than zero.', 'validation-error');
    }

    let gamification = await prisma.tenantGamification.findUnique({
       where: { tenant_id }
    });

    if (!gamification) {
      return problemResponse(res, 404, 'Not Found', 'Gamification profile does not exist.', 'not-found');
    }

    gamification = await prisma.tenantGamification.update({
       where: { tenant_id },
       data: {
          current_savings: gamification.current_savings + amount,
          updated_at: new Date().toISOString()
       }
    });

    return res.status(201).json({
      success: true,
      new_balance: gamification.current_savings
    });

  } catch (error: any) {
    console.error('[Tenant Gamification Deposit Error]', error.message);
    return problemResponse(res, 500, 'Internal Server Error', 'Engine failed processing savings deposit.', 'internal-server-error');
  }
};
