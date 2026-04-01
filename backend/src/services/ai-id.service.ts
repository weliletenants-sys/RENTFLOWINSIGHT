import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AiIdService {
  /**
   * Fetch aggregate data for the AI ID profile strictly matching the OpenAPI schema.
   * If a record isn't found, defaults are returned.
   */
  static async getProfileData(aiId: string) {
    // 1. Fetch base profile
    const profile = await prisma.profiles.findUnique({
      where: { ai_id: aiId },
    });

    if (!profile) return null;

    // 2. Fetch Risk Scores
    const riskScore = await prisma.userRiskScores.findFirst({
      where: { user_id: profile.id },
      orderBy: { created_at: 'desc' }
    });

    // 3. Fetch Rent Requests
    const rentRequests = await prisma.rentRequests.findMany({
      where: { tenant_id: profile.id },
      select: { rent_amount: true, status: true, total_repayment: true, amount_repaid: true }
    });

    const total_rent_requests = rentRequests.length;
    let funded_requests = 0;
    let total_rent_facilitated = 0;
    
    // Quick estimation for on_time_payment_rate based on repaid amounts versus scheduled
    let fullyRepaid = 0;
    
    for (const req of rentRequests) {
      if (req.status === 'funded' || req.status === 'active' || req.status === 'closed' || req.status === 'completed') {
        funded_requests++;
        total_rent_facilitated += req.rent_amount;
      }
      if (req.amount_repaid >= req.total_repayment && req.total_repayment > 0) {
        fullyRepaid++;
      }
    }

    const on_time_payment_rate = funded_requests > 0 ? (fullyRepaid / funded_requests) * 100 : 100;

    // 4. Fetch Referrals
    const referralCount = await prisma.referrals.count({
      where: { referrer_id: profile.id }
    });

    // 5. Fetch Borrowing Limit
    const creditAccess = await prisma.creditAccessLimits.findFirst({
      where: { user_id: profile.id },
      orderBy: { created_at: 'desc' }
    });

    const estimated_borrowing_limit = creditAccess?.total_limit || creditAccess?.base_limit || 0;

    // Derive "Can Lend" based on score > 80 (configurable)
    const finalRiskScore = riskScore?.risk_score || 0;
    const can_lend = finalRiskScore > 80;

    return {
      ai_id: aiId,
      risk_level: riskScore?.risk_level || 'New Member',
      risk_score: finalRiskScore,
      on_time_payment_rate: parseFloat(on_time_payment_rate.toFixed(1)),
      total_rent_facilitated,
      total_rent_requests,
      funded_requests,
      estimated_borrowing_limit,
      referral_count: referralCount,
      member_since: profile.created_at,
      can_lend,
      // Internal values specifically for /me endpoint
      user_id: profile.id 
    };
  }

  static async getWalletBalance(userId: string): Promise<number> {
    const wallet = await prisma.wallets.findFirst({
      where: { user_id: userId }
    });
    return wallet?.balance || 0;
  }
}
