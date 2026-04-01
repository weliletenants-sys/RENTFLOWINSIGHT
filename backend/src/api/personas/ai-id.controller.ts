import { Request, Response } from 'express';
import { AiIdService } from '../../services/ai-id.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AiIdController {
  /**
   * GET /v1/personas/ai-id/me
   * Fetches the full profile for the authenticated user
   */
  static async getMyProfile(req: Request, res: Response): Promise<any> {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({
          type: "https://api.welile.com/errors/unauthorized",
          title: "Unauthorized",
          status: 401,
          detail: "Missing authentication token",
        });
      }

      let profileInfo = await prisma.profiles.findUnique({ where: { id: user.id }, select: { ai_id: true } });
      
      // Auto-generate AI ID if missing to unlock dashboard metrics
      if (!profileInfo || !profileInfo.ai_id) {
        const newAiId = `AI-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        await prisma.profiles.update({
          where: { id: user.id },
          data: { ai_id: newAiId }
        });
        profileInfo = { ai_id: newAiId };
      }

      const profileData = await AiIdService.getProfileData(profileInfo.ai_id);
      if (!profileData) {
        return res.status(404).json({
          type: "https://api.welile.com/errors/not-found",
          title: "Not Found",
          status: 404,
          detail: "Could not accumulate AI Profile details.",
        });
      }

      // Private wallet balance lookup
      const walletBalance = await AiIdService.getWalletBalance(user.id);

      const response = {
        ai_id: profileData.ai_id,
        risk_level: profileData.risk_level,
        risk_score: profileData.risk_score,
        on_time_payment_rate: profileData.on_time_payment_rate,
        total_rent_facilitated: profileData.total_rent_facilitated,
        total_rent_requests: profileData.total_rent_requests,
        funded_requests: profileData.funded_requests,
        estimated_borrowing_limit: profileData.estimated_borrowing_limit,
        wallet_balance: walletBalance,
        referral_count: profileData.referral_count,
        member_since: profileData.member_since,
        can_lend: profileData.can_lend
      };

      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        type: "https://api.welile.com/errors/internal-server-error",
        title: "Internal Error",
        status: 500,
        detail: "Failed to process AI ID request.",
      });
    }
  }

  /**
   * GET /v1/personas/ai-id/:ai_id
   * Fetches the public profile for a specific AI ID (scrubs wallet)
   */
  static async getProfileById(req: Request, res: Response): Promise<any> {
    try {
      const aiId = req.params.ai_id;
      if (!aiId) {
        return res.status(400).json({
          type: "https://api.welile.com/errors/bad-request",
          title: "Bad Request",
          status: 400,
          detail: "Missing ai_id parameter in path.",
        });
      }

      const profileData = await AiIdService.getProfileData(aiId);
      
      if (!profileData) {
        return res.status(404).json({
          type: "https://api.welile.com/errors/not-found",
          title: "Not Found",
          status: 404,
          detail: `No profile matching AI ID ${aiId}`,
        });
      }

      const response = {
        ai_id: profileData.ai_id,
        risk_level: profileData.risk_level,
        risk_score: profileData.risk_score,
        on_time_payment_rate: profileData.on_time_payment_rate,
        total_rent_facilitated: profileData.total_rent_facilitated,
        total_rent_requests: profileData.total_rent_requests,
        funded_requests: profileData.funded_requests,
        estimated_borrowing_limit: profileData.estimated_borrowing_limit,
        wallet_balance: null, // Scrubbed!
        referral_count: profileData.referral_count,
        member_since: profileData.member_since,
        can_lend: profileData.can_lend
      };

      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        type: "https://api.welile.com/errors/internal-server-error",
        title: "Internal Error",
        status: 500,
        detail: "Failed to process AI ID request.",
      });
    }
  }
}
