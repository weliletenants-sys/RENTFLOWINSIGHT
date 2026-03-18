import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../prisma/prisma.client';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    
    const portfolios = await prisma.investorPortfolios.findMany({
      where: { investor_id: userId },
    });

    const wallet = await prisma.wallets.findFirst({ where: { user_id: userId } });
    const walletBalance = wallet ? wallet.balance : 0;

    const principalInvested = portfolios.reduce((sum: number, p: any) => sum + p.investment_amount, 0);
    const monthlyReturn = portfolios.reduce((sum: number, p: any) => sum + (p.investment_amount * (p.roi_percentage / 100)), 0);

    return res.status(200).json({
      walletBalance,
      principalInvested,
      monthlyReturn,
      roiPercent: portfolios.length > 0 ? portfolios[0].roi_percentage : 15
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getVirtualHouses = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    
    // Virtual Houses represent funded rent requests where the user is the funder
    const fundedRequests = await prisma.rentRequests.findMany({
      where: { supporter_id: userId, status: 'FUNDED' },
      select: {
        id: true,
        rent_amount: true,
        funded_at: true,
        amount_repaid: true,
        daily_repayment: true,
        access_fee: true,
        request_fee: true,
        duration_days: true,
      }
    });

    // Anonymize and map payment health
    const virtualHouses = fundedRequests.map((req: any) => {
      const totalPayable = req.rent_amount + req.access_fee + req.request_fee;
      const expectedDaysPassed = Math.floor((new Date().getTime() - new Date(req.funded_at).getTime()) / (1000 * 3600 * 24));
      const expectedPaid = Math.min(expectedDaysPassed * req.daily_repayment, totalPayable);
      
      let health = 'GREEN';
      if (req.amount_repaid < expectedPaid - (req.daily_repayment * 7)) health = 'RED';
      else if (req.amount_repaid < expectedPaid) health = 'YELLOW';

      return {
        id: `VH-${req.id.substring(0, 8)}`,
        rentAmount: req.rent_amount,
        fundedAt: req.funded_at,
        health,
      };
    });

    return res.status(200).json(virtualHouses);
  } catch (error) {
    console.error('Virtual Houses Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const fundPool = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const { amount, duration_months, roi_mode } = req.body;

    if (!amount || amount < 50000) {
      return res.status(400).json({ message: 'Invalid amount or below minimum (50,000)' });
    }

    const wallet = await prisma.wallets.findFirst({ where: { user_id: userId } });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Atomic transaction logic simplified for migration placeholder
    // In complete application, this would run inside prisma.$transaction
    await prisma.generalLedger.create({
      data: {
        user_id: userId,
        amount,
        direction: 'cash_out',
        category: 'supporter_rent_fund',
        source_table: 'wallets',
        transaction_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      }
    });

    await prisma.wallets.update({
      where: { id: wallet.id },
      data: { balance: wallet.balance - amount }
    });

    const portfolio = await prisma.investorPortfolios.create({
      data: {
        investor_id: userId,
        investment_amount: amount,
        roi_percentage: 15,
        duration_months: duration_months || 12, // Custom duration payload
        status: 'active',
        portfolio_code: `WPF-${Math.floor(Math.random() * 10000)}`,
        activation_token: 'active',
        portfolio_pin: '0000',
        roi_mode: roi_mode || 'monthly_compounding',
        total_roi_earned: 0,
        created_at: new Date().toISOString()
      }
    });

    return res.status(201).json({ message: 'Funded successfully', portfolio });
  } catch (error) {
    console.error('Fund Pool Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const proxyInvest = async (req: Request, res: Response) => {
  try {
    const agentId = req.user?.sub;
    const { partnerId, amount } = req.body;

    if (!partnerId || !amount || amount < 50000) {
      return res.status(400).json({ message: 'Invalid payload or amount too low' });
    }

    const agentWallet = await prisma.wallets.findFirst({ where: { user_id: agentId } });
    if (!agentWallet || agentWallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient agent funds' });
    }

    // Deduct from Agent mapping
    await prisma.generalLedger.create({
      data: {
        user_id: agentId,
        amount,
        direction: 'cash_out',
        category: 'agent_proxy_investment',
        source_table: 'wallets',
        transaction_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      }
    });

    await prisma.wallets.update({
      where: { id: agentWallet.id },
      data: { balance: agentWallet.balance - amount }
    });

    // Create pending portfolio for partner
    const portfolio = await prisma.investorPortfolios.create({
      data: {
        investor_id: partnerId,
        agent_id: agentId,
        investment_amount: amount,
        roi_percentage: 15,
        duration_months: 12,
        status: 'pending_approval',
        portfolio_code: `WIP-${Math.floor(Math.random() * 10000)}`,
        activation_token: 'pending',
        portfolio_pin: '0000',
        roi_mode: 'monthly_compounding',
        total_roi_earned: 0,
        created_at: new Date().toISOString()
      }
    });

    // Queue Partner Capital Credit
    await prisma.pendingWalletOperations.create({
      data: {
        user_id: partnerId,
        amount,
        direction: 'cash_in',
        category: 'supporter_facilitation_capital',
        source_table: 'investor_portfolios',
        reference_id: portfolio.id,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });

    // Queue Agent Commission (2%)
    await prisma.pendingWalletOperations.create({
      data: {
        user_id: agentId,
        amount: amount * 0.02,
        direction: 'cash_in',
        category: 'proxy_investment_commission',
        source_table: 'investor_portfolios',
        reference_id: portfolio.id,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });

    return res.status(201).json({ message: 'Proxy investment queued for approval', portfolio });
  } catch (error) {
    console.error('Proxy Invest Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getInvestmentOptions = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      defaultRoi: 15,
      allowedDurations: [6, 12, 18, 24],
      allowedRoiModes: ['monthly_compounding', 'end_of_term', 'monthly_payout']
    });
  } catch (error) {
    console.error('Investment Options Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const funderSignup = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    if (!email || !password || !firstName || !lastName || !phone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const existingUser = await prisma.profiles.findFirst({ where: { email } });
    if (existingUser) return res.status(409).json({ message: 'Email already exists' });
    
    const password_hash = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();
    
    const profile = await prisma.profiles.create({
      data: {
        email,
        full_name: `${firstName} ${lastName}`,
        phone,
        password_hash,
        role: 'FUNDER',
        is_frozen: false,
        verified: true,
        rent_discount_active: false,
        created_at: now,
        updated_at: now,
      }
    });
    
    await prisma.userRoles.create({
      data: { role: 'FUNDER', user_id: profile.id, enabled: true, created_at: now }
    });
    
    await prisma.wallets.create({
      data: { balance: 0, user_id: profile.id, created_at: now, updated_at: now }
    });
    
    const payload = { email: profile.email, sub: profile.id, role: 'FUNDER' };
    const access_token = jwt.sign(payload, JWT_SECRET);
    
    return res.status(201).json({
      access_token,
      user: { id: profile.id, email: profile.email, firstName, lastName, role: 'FUNDER' }
    });
  } catch (error) {
    console.error('Funder Signup Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const funderOnboard = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const { 
      nationalId, nextOfKinName, nextOfKinPhone, accountName, accountNumber, bankName 
    } = req.body;
    
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    
    const profile = await prisma.profiles.findUnique({ where: { id: userId } });
    if (!profile) return res.status(404).json({ message: 'User not found' });
    
    // Create SupporterInvites document acting as KYC record
    const kycRecord = await prisma.supporterInvites.create({
      data: {
        email: profile.email,
        phone: profile.phone,
        full_name: profile.full_name,
        role: 'FUNDER',
        status: 'active',
        created_by: profile.id,
        created_at: new Date().toISOString(),
        activation_token: 'native-signup',
        activated_at: new Date().toISOString(),
        activated_user_id: profile.id,
        national_id: nationalId || null,
        next_of_kin_name: nextOfKinName || null,
        next_of_kin_phone: nextOfKinPhone || null,
        account_name: accountName || null,
        account_number: accountNumber || null,
        bank_name: bankName || null,
      }
    });
    
    // Update profile verified status
    await prisma.profiles.update({
      where: { id: userId },
      data: { verified: true, updated_at: new Date().toISOString() }
    });
    
    return res.status(201).json({ message: 'Onboarding complete', kycRecord });
  } catch (error) {
    console.error('Funder Onboard Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const cooProxyInvest = async (req: Request, res: Response) => {
  try {
    const { partnerId, amount } = req.body;

    if (!partnerId || !amount || amount < 50000) {
      return res.status(400).json({ message: 'Invalid payload or amount too low' });
    }

    const partnerWallet = await prisma.wallets.findFirst({ where: { user_id: partnerId } });
    if (!partnerWallet || partnerWallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient partner funds' });
    }

    // Deduct from Partner Wallet
    await prisma.generalLedger.create({
      data: {
        user_id: partnerId,
        amount,
        direction: 'cash_out',
        category: 'coo_proxy_investment',
        source_table: 'wallets',
        transaction_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      }
    });

    await prisma.wallets.update({
      where: { id: partnerWallet.id },
      data: { balance: partnerWallet.balance - amount }
    });

    // Create active portfolio for partner
    const portfolio = await prisma.investorPortfolios.create({
      data: {
        investor_id: partnerId,
        investment_amount: amount,
        roi_percentage: 15,
        duration_months: 12,
        status: 'active',
        portfolio_code: `WPF-${Math.floor(Math.random() * 10000)}`,
        activation_token: 'active',
        portfolio_pin: '0000',
        roi_mode: 'monthly_compounding',
        total_roi_earned: 0,
        created_at: new Date().toISOString()
      }
    });

    return res.status(201).json({ message: 'COO Proxy investment activated', portfolio });
  } catch (error) {
    console.error('COO Proxy Invest Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const requestWithdrawal = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const { amount, reason } = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const now = new Date();
    const earliestProcessDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const withdrawal = await prisma.investmentWithdrawalRequests.create({
      data: {
        user_id: userId,
        amount,
        status: 'pending',
        rewards_paused: true,
        reason: reason || null,
        requested_at: now.toISOString(),
        earliest_process_date: earliestProcessDate.toISOString(),
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      }
    });

    return res.status(201).json({ message: 'Withdrawal request submitted. 90-day notice active.', withdrawal });
  } catch (error) {
    console.error('Request Withdrawal Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const processRoi = async (req: Request, res: Response) => {
  try {
    // 1. Fetch active portfolios (in this simplified version, we just fetch active portfolios instead of linked rent requests)
    const activePortfolios = await prisma.investorPortfolios.findMany({
      where: { status: 'active' }
    });

    let processedCount = 0;
    const now = new Date();

    for (const portfolio of activePortfolios) {
      if (!portfolio.investor_id) continue;

      // Check if this supporter has active withdrawal requests (rewards paused)
      const activeWithdrawal = await prisma.investmentWithdrawalRequests.findFirst({
        where: {
          user_id: portfolio.investor_id,
          rewards_paused: true,
          status: { in: ['pending', 'approved'] }
        }
      });

      if (activeWithdrawal) continue; // Skip rewards

      // Simplified logic: calculate 15% reward
      const monthlyReward = portfolio.investment_amount * (portfolio.roi_percentage / 100);

      // Insert ROI payment record
      await prisma.supporterRoiPayments.create({
        data: {
          supporter_id: portfolio.investor_id,
          roi_amount: monthlyReward,
          rent_amount: portfolio.investment_amount,
          payment_number: 1,
          due_date: now.toISOString(),
          status: 'pending',
          created_at: now.toISOString()
        }
      });

      // Queue the reward in PendingWalletOperations
      await prisma.pendingWalletOperations.create({
        data: {
          user_id: portfolio.investor_id,
          amount: monthlyReward,
          direction: 'cash_in',
          category: 'supporter_platform_rewards',
          source_table: 'investor_portfolios',
          reference_id: portfolio.id,
          status: 'pending',
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        }
      });

      // Update next ROI date
      const nextRoi = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      await prisma.investorPortfolios.update({
        where: { id: portfolio.id },
        data: {
          next_roi_date: nextRoi.toISOString(),
          total_roi_earned: { increment: monthlyReward }
        }
      });

      processedCount++;
    }

    return res.status(200).json({ message: `ROI processed successfully for ${processedCount} portfolios.` });
  } catch (error) {
    console.error('Process ROI Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getPortfolios = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    
    const portfolios = await prisma.investorPortfolios.findMany({
      where: { investor_id: userId },
      orderBy: { created_at: 'desc' }
    });

    const formattedPortfolios = portfolios.map((p) => {
      const createdDate = new Date(p.created_at);
      const maturityDate = new Date(createdDate.getTime() + (p.duration_months || 12) * 30 * 24 * 60 * 60 * 1000);
      
      return {
        id: p.id,
        portfolioCode: p.portfolio_code || `WEL-${Math.floor(Math.random() * 99).toString().padStart(2, '0')}`,
        assetName: 'Welile Housing Pool',
        investedAmount: p.investment_amount,
        totalEarned: p.total_roi_earned || 0,
        roiPercent: p.roi_percentage,
        durationMonths: p.duration_months || 12,
        payoutType: p.roi_mode === 'monthly_compounding' ? 'Compounding' : 'Monthly',
        nextPayoutDate: p.next_roi_date ? new Date(p.next_roi_date).toLocaleDateString('en-GB') : undefined,
        maturityDate: maturityDate.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: p.status
      };
    });

    return res.status(200).json(formattedPortfolios);
  } catch (error) {
    console.error('Get Portfolios Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getActivities = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;

    const pendingOps = await prisma.pendingWalletOperations.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 10
    });

    const formattedActivities = pendingOps.map((op: any) => {
      return {
        id: op.id,
        title: op.category === 'supporter_platform_rewards' ? 'Monthly Earnings' : 'New Investment',
        category: op.direction === 'cash_in' ? 'reward' : 'investment',
        status: op.status.toUpperCase(),
        provider: 'Welile Pool',
        date: new Date(op.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        timestamp: 'Recently',
        amount: op.amount,
        isCredit: op.direction === 'cash_in'
      };
    });

    return res.status(200).json(formattedActivities);
  } catch (error) {
    console.error('Get Activities Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
