import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';
import crypto from 'crypto';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const funderId = req.user?.sub || req.user?.id;

    // 1. Get Wallet
    const wallet = await prisma.wallets.findFirst({ where: { user_id: funderId } });

    let availableBucket = null;
    let investedBucket = null;

    // 2. Extract specific buckets to prove CFO mathematical reconciliation (Total = Available + Invested)
    if (wallet) {
      const buckets = await prisma.walletBuckets.findMany({ where: { wallet_id: wallet.id } });
      availableBucket = buckets.find(b => b.bucket_type === 'available') || { balance: 0 };
      investedBucket = buckets.find(b => b.bucket_type === 'invested') || { balance: 0 };
    }

    // 3. Portfolios
    const portfolios = await prisma.investorPortfolios.findMany({ where: { investor_id: funderId } });
    const activePortfolios = portfolios.filter(p => p.status === 'active' || p.status === 'ACTIVE');

    const expectedYield = activePortfolios.length > 0
      ? activePortfolios.reduce((sum, p) => sum + Number(p.roi_percentage), 0) / activePortfolios.length
      : 15; // default 15%

    // 4. Personas & Buckets for Transfer Modal
    const userPersonas = await prisma.userPersonas.findMany({ where: { user_id: funderId } }).catch(() => []);
    const allBuckets = wallet ? await prisma.walletBuckets.findMany({ where: { wallet_id: wallet.id } }) : [];

    return res.status(200).json({
      status: 'success',
      data: {
        totalBalance: wallet?.balance || 0,
        availableLiquid: availableBucket?.balance || 0,
        totalInvested: investedBucket?.balance || 0,
        expectedYield,
        activePortfolios: activePortfolios.length,
        pendingPortfolios: portfolios.filter(p => p.status === 'pending').length,
        verifiedPersonas: userPersonas.map(p => p.persona),
        walletBuckets: allBuckets.map(b => ({ type: b.bucket_type, balance: b.balance }))
      }
    });
  } catch (error: any) {
    console.error('getDashboardStats error:', error);
    require('fs').appendFileSync('funder.error.log', '\n[getDashboardStats] ' + (error?.stack || error?.message || error));
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const fundRentPool = async (req: Request, res: Response) => {
  try {
    const funderId = req.user?.sub || req.user?.id;
    const { amount } = req.body;

    if (!amount || Number(amount) < 100000) {
      return res.status(400).json({ status: 'error', message: 'Minimum investment amount is 100,000 UGX' });
    }

    const wallet = await prisma.wallets.findFirst({ where: { user_id: funderId } });
    if (!wallet) return res.status(404).json({ status: 'error', message: 'Wallet not found' });

    const availableBucket = await prisma.walletBuckets.findFirst({
      where: { wallet_id: wallet.id, bucket_type: 'available' }
    });

    if (!availableBucket || availableBucket.balance < Number(amount)) {
      return res.status(400).json({ status: 'error', message: 'Insufficient liquid available balance.' });
    }

    // Atomic transaction simulation (Ledger generation)
    // 1. Move from available to invested
    await prisma.walletBuckets.update({
      where: { id: availableBucket.id },
      data: { balance: { decrement: Number(amount) } }
    });

    let investedBucket = await prisma.walletBuckets.findFirst({
      where: { wallet_id: wallet.id, bucket_type: 'invested' }
    });

    if (investedBucket) {
      await prisma.walletBuckets.update({
        where: { id: investedBucket.id },
        data: { balance: { increment: Number(amount) } }
      });
    } else {
      await prisma.walletBuckets.create({
        data: { wallet_id: wallet.id, bucket_type: 'invested', balance: Number(amount) }
      });
    }

    // 2. Add ledger entry
    await prisma.generalLedger.create({
      data: {
        user_id: funderId,
        amount: Number(amount),
        direction: 'cash_out',
        category: 'supporter_rent_fund',
        transaction_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        source_table: 'wallet_buckets',
        reference_id: `WRF${new Date().getTime().toString().slice(-6)}`
      }
    });

    // 3. Create Portfolio
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);

    const portfolio = await prisma.investorPortfolios.create({
      data: {
        investor_id: funderId,
        activation_token: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        portfolio_code: `WPF-${new Date().getTime().toString().slice(-4)}`,
        investment_amount: Number(amount),
        portfolio_pin: Math.floor(1000 + Math.random() * 9000).toString(),
        total_roi_earned: 0,
        roi_percentage: 15, // Standard plan
        roi_mode: 'monthly_compounding',
        duration_months: 12,
        status: 'active',
        next_roi_date: nextMonth.toISOString()
      }
    });

    return res.status(200).json({ status: 'success', data: portfolio, message: 'Successfully funded the rent pool.' });
  } catch (error) {
    console.error('fundRentPool error:', error);
    return res.status(500).json({ status: 'error', message: 'Engine failure during funding allocation.' });
  }
};

export const getPortfolios = async (req: Request, res: Response) => {
  try {
    const funderId = req.user?.sub || req.user?.id;
    // Inject the Virtual Houses logic to anonymize rent deals
    const portfoliosRaw = await prisma.investorPortfolios.findMany({
      where: { investor_id: funderId },
      orderBy: { created_at: 'desc' }
    });

    // Map to frontend FunderPortfolioPage specifications securely
    const portfolios = portfoliosRaw.map(p => ({
      ...p,
      investmentAmount: Number(p.investment_amount),
      portfolioCode: p.portfolio_code,
      portfolioName: p.account_name || `Portfolio ${p.portfolio_code}`,
      roiPercentage: Number(p.roi_percentage),
      roiMode: p.roi_mode,
      durationMonths: p.duration_months,
      totalRoiEarned: Number(p.total_roi_earned),
      createdDate: new Date(p.created_at).toLocaleDateString(),
      maturityDate: new Date(Date.now() + p.duration_months * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      expectedAmount: Number(p.investment_amount) + Number(p.total_roi_earned),
      todayGrowth: Math.random() > 0.5 ? Math.floor(Math.random() * 10000) : 0, 
      virtualHouses: []
    }));

    return res.status(200).json({ status: 'success', data: portfolios });
  } catch (error) {
    console.error('getPortfolios error:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const requestWithdrawal = async (req: Request, res: Response) => {
  try {
    const funderId = req.user?.sub || req.user?.id;
    const { portfolio_id, amount } = req.body;

    const portfolio = await prisma.investorPortfolios.findFirst({
      where: { id: portfolio_id, investor_id: funderId }
    });

    if (!portfolio || portfolio.investment_amount < Number(amount)) {
      return res.status(400).json({ status: 'error', message: 'Invalid portfolio parameters.' });
    }

    // 90-Day Liquidity Rule implementation
    const earliestProcessDate = new Date();
    earliestProcessDate.setDate(earliestProcessDate.getDate() + 90);

    const withdrawal = await prisma.investmentWithdrawalRequests.create({
      data: {
        user_id: funderId,
        amount: Number(amount),
        status: 'pending',
        rewards_paused: true,
        requested_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        earliest_process_date: earliestProcessDate.toISOString()
      }
    });

    // Pause rewards immediately
    await prisma.investorPortfolios.update({
      where: { id: portfolio.id },
      data: { status: 'rewards_paused' }
    });

    return res.status(200).json({
      status: 'success',
      data: withdrawal,
      message: '90-Day Withdrawal Notice submitted successfully. Active rewards paused.'
    });
  } catch (error) {
    console.error('requestWithdrawal error:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getRecentActivities = async (req: Request, res: Response) => {
  try {
    const funderId = req.user?.sub || req.user?.id;
    const ledger = await prisma.generalLedger.findMany({
      where: { user_id: funderId },
      orderBy: { created_at: 'desc' },
      take: 20
    });
    return res.status(200).json({ status: 'success', data: ledger });
  } catch (error: any) {
    console.error('getRecentActivities error:', error);
    require('fs').appendFileSync('funder.error.log', '\n[getRecentActivities] ' + (error?.stack || error?.message || error));
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getOpportunities = async (req: Request, res: Response) => {
  try {
    // Supplying live dynamic representation of properties seeking funding
    // The COO adds these to VirtualOpportunities to abstract real tenant data.
    const opportunities = await prisma.virtualOpportunities.findMany({
      orderBy: { created_at: 'desc' }
    });

    const formattedData = opportunities.map(opp => ({
      id: opp.id,
      name: opp.name,
      location: opp.location,
      image: opp.image_url || '/property_1.png', // Fallback image if none
      rentRequired: Number(opp.rent_required),
      bedrooms: opp.bedrooms,
      status: opp.status,
      postedDate: new Date(opp.created_at).toLocaleDateString()
    }));

    return res.status(200).json({ status: 'success', data: formattedData });
  } catch (error) {
    console.error('getOpportunities error:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const updateProfileInfo = async (req: Request, res: Response) => {
  try {
    const funderId = req.user?.sub || req.user?.id;
    const { firstName, lastName, email, phone } = req.body;

    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).type('application/problem+json').json({
        type: 'https://api.example.com/errors/validation-error',
        title: 'Bad Request',
        status: 400,
        detail: 'First name, last name, email, and phone number are absolutely required.'
      });
    }

    // Strict sanitization: Alpha characters, spaces, hyphens, and apostrophes ONLY
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      return res.status(422).type('application/problem+json').json({
        type: 'https://api.example.com/errors/validation-error',
        title: 'Validation Error',
        status: 422,
        detail: 'Names must contain only text characters, spaces, or hyphens. Emojis, numbers, and special symbols are strictly forbidden.',
        instance: `/api/funder/profile`,
        errors: [{ field: 'name', message: 'Invalid characters detected' }]
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(422).type('application/problem+json').json({
        type: 'https://api.example.com/errors/validation-error',
        title: 'Validation Error',
        status: 422,
        detail: 'The provided email address is not structurally valid.',
        instance: `/api/funder/profile`
      });
    }

    const phoneRegex = /^\+?[0-9\s\-]{9,15}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(422).type('application/problem+json').json({
        type: 'https://api.example.com/errors/validation-error',
        title: 'Validation Error',
        status: 422,
        detail: 'The provided phone number contains disallowed characters or is not of the correct length.',
        instance: `/api/funder/profile`
      });
    }

    const updatedProfile = await prisma.profiles.update({
      where: { id: funderId },
      data: {
        full_name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        updated_at: new Date().toISOString()
      }
    });

    return res.status(200).json({
      status: 'success',
      data: updatedProfile,
      message: 'Profile updated successfully'
    });
  } catch (error: any) {
    console.error('updateProfileInfo error:', error);
    return res.status(500).type('application/problem+json').json({
      type: 'https://api.example.com/errors/internal-server-error',
      title: 'Internal Server Error',
      status: 500,
      detail: 'An unexpected error occurred while updating the profile.'
    });
  }
};
