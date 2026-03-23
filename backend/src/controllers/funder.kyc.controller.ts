import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Handle Funder Profile Photo (Avatar) Upload
 */
export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub || req.user?.id;
    
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded.' });
    }

    const { location: avatarUrl } = req.file as any;

    // Update the user's profile with the new S3 URL
    await prisma.profiles.updateMany({
      where: { id: userId }, // Assuming Profiles id matches or there's a user_id link
      data: { avatar_url: avatarUrl }
    });

    return res.status(200).json({ 
      status: 'success', 
      message: 'Avatar securely uploaded.',
      data: { avatarUrl } 
    });
  } catch (error) {
    console.error('S3 Avatar Upload Error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to process S3 upload stream.' });
  }
};

/**
 * Handle Funder KYC Documents Upload (Front and Back IDs)
 */
export const uploadKycDocuments = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub || req.user?.id;
    
    if (!req.files) {
      return res.status(400).json({ status: 'error', message: 'No KYC documents uploaded.' });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    const frontIdFile = files['front_id']?.[0] as any;
    const backIdFile = files['back_id']?.[0] as any;

    if (!frontIdFile || !backIdFile) {
      return res.status(400).json({ status: 'error', message: 'Both front and back ID files are absolutely required.' });
    }

    const frontUrl = frontIdFile.location;
    const backUrl = backIdFile.location;

    let isAlreadySubmitted = false;
    if (userId) {
      const existingProfile = await prisma.profiles.findUnique({
        where: { id: userId },
        // @ts-ignore
        select: { kyc_status: true }
      });
      // @ts-ignore
      isAlreadySubmitted = existingProfile?.kyc_status === 'UNDER_REVIEW' || existingProfile?.kyc_status === 'APPROVED';
    }

    // Only create a notification if they aren't already under review/approved
    if (userId && !isAlreadySubmitted) {
      // ── Enforce DB integrity with a Transaction ──────────────────────────
      await prisma.$transaction([
        prisma.notifications.create({
          data: {
            user_id: userId,
            type: 'KYC_SUBMITTED',
            title: 'KYC Documents Submitted',
            message: 'Your identity documents have been received and are now under review by our compliance team. We will notify you once the review is complete (usually within 24–48 hours).',
            is_read: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            metadata: {
              front_id_url: frontUrl,
              back_id_url: backUrl,
            },
          },
        }),
        prisma.profiles.update({
          where: { id: userId },
          data: {
            kyc_status: 'UNDER_REVIEW',
            kyc_submitted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        })
      ]);
    }
    
    return res.status(200).json({ 
      status: 'success', 
      message: 'KYC Documents uploaded successfully. Under review.',
      data: { 
        front_id_url: frontUrl,
        back_id_url: backUrl,
        kyc_status: 'UNDER_REVIEW',
      } 
    });
  } catch (error: any) {
    const contextUserId = req.user?.sub || req.user?.id || 'unknown';
    logger.error(`[KYC Upload] Failed for user ${contextUserId}`, { 
      error: error?.message || String(error),
      stack: error?.stack
    });
    console.error(`S3 KYC Documents Upload Error for ${contextUserId}:`, error);
    
    return res.status(500).json({ 
      status: 'error', 
      message: 'Failed to stream multi-part documents to AWS or save to database.',
      details: error?.message || String(error)
    });
  }
};

/**
 * GET /funder/kyc/status
 * Returns the current KYC status for the authenticated user from the profiles table.
 */
export const getKycStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub || req.user?.id;
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const profile = await prisma.profiles.findUnique({
      where: { id: userId },
      select: {
        // @ts-ignore — field added in migration; client regenerated
        kyc_status: true,
        // @ts-ignore
        kyc_submitted_at: true,
        // @ts-ignore
        kyc_approved_at: true,
        // @ts-ignore
        kyc_rejected_reason: true,
      },
    });

    if (!profile) {
      return res.status(404).json({ status: 'error', message: 'Profile not found' });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        // @ts-ignore
        kyc_status:          profile.kyc_status          ?? 'NOT_SUBMITTED',
        // @ts-ignore
        kyc_submitted_at:    profile.kyc_submitted_at    ?? null,
        // @ts-ignore
        kyc_approved_at:     profile.kyc_approved_at     ?? null,
        // @ts-ignore
        kyc_rejected_reason: profile.kyc_rejected_reason ?? null,
      },
    });
  } catch (error) {
    console.error('Get KYC Status Error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to fetch KYC status' });
  }
};

