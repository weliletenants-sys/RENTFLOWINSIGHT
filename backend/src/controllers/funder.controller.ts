import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';
import crypto from 'crypto';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const funderId = req.user?.sub || req.user?.id;

    // 1. Get Wallet
    const wallet = await prisma.wallets.findFirst({ where: { user_id: funderId } });

    let availableBucket: any = null;
    let investedBucket: any = null;

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

    // 5. Next of Kin Data
    const invite = await prisma.supporterInvites.findFirst({ where: { activated_user_id: funderId } });

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
        walletBuckets: allBuckets.map(b => ({ type: b.bucket_type, balance: b.balance })),
        nextOfKinName: invite?.next_of_kin_name || null,
        nextOfKinPhone: invite?.next_of_kin_phone || null,
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
    const { amount, duration_months = 12, roi_mode = 'monthly_compounding', auto_renew = false, account_name } = req.body;

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
        roi_percentage: 15,
        roi_mode: String(roi_mode),
        duration_months: Number(duration_months),
        auto_renew: Boolean(auto_renew),
        account_name: account_name ? String(account_name) : null,
        status: 'active',
        next_roi_date: nextMonth.toISOString()
      }
    });

    await prisma.notifications.create({
      data: {
        user_id: funderId,
        type: 'investment',
        title: 'Investment Successful',
        message: `You have successfully funded a new ${duration_months}-month rent pool with ${Number(amount).toLocaleString()} UGX.`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });

    return res.status(200).json({ status: 'success', data: portfolio, message: 'Successfully funded the rent pool.' });
  } catch (error) {
    console.error('fundRentPool error:', error);
    return res.status(500).json({ status: 'error', message: 'Engine failure during funding allocation.' });
  }
};

export const topupRentPool = async (req: Request, res: Response) => {
  try {
    const funderId = req.user?.sub || req.user?.id;
    const { code } = req.params;
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ status: 'error', message: 'Invalid top-up amount.' });
    }

    const wallet = await prisma.wallets.findFirst({ where: { user_id: funderId } });
    if (!wallet) return res.status(404).json({ status: 'error', message: 'Wallet not found' });

    const availableBucket = await prisma.walletBuckets.findFirst({
      where: { wallet_id: wallet.id, bucket_type: 'available' }
    });

    if (!availableBucket || availableBucket.balance < Number(amount)) {
      return res.status(400).json({ status: 'error', message: 'Insufficient liquid available balance.' });
    }

    const portfolio = await prisma.investorPortfolios.findFirst({
      where: { portfolio_code: code, investor_id: funderId }
    });

    if (!portfolio || (portfolio.status !== 'active' && portfolio.status !== 'ACTIVE')) {
      return res.status(400).json({ status: 'error', message: 'Invalid or inactive portfolio code.' });
    }

    // 1. Transaction Simulation
    await prisma.walletBuckets.update({
      where: { id: availableBucket.id },
      data: { balance: { decrement: Number(amount) } }
    });

    const investedBucket = await prisma.walletBuckets.findFirst({
      where: { wallet_id: wallet.id, bucket_type: 'invested' }
    });

    if (investedBucket) {
      await prisma.walletBuckets.update({
        where: { id: investedBucket.id },
        data: { balance: { increment: Number(amount) } }
      });
    }

    // 2. Ledger Update
    await prisma.generalLedger.create({
      data: {
        user_id: funderId,
        amount: Number(amount),
        direction: 'cash_out',
        category: 'supporter_top_up',
        transaction_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        source_table: 'investor_portfolios',
        reference_id: portfolio.portfolio_code
      }
    });

    // 3. Augment Portfolio
    await prisma.investorPortfolios.update({
      where: { id: portfolio.id },
      data: { investment_amount: { increment: Number(amount) } }
    });

    await prisma.notifications.create({
      data: {
        user_id: funderId,
        type: 'investment',
        title: 'Portfolio Top-up Successful',
        message: `You successfully injected ${Number(amount).toLocaleString()} UGX into Portfolio ${portfolio.portfolio_code}.`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });

    return res.status(200).json({ status: 'success', message: 'Successfully injected capital.' });
  } catch (error) {
    console.error('topupRentPool error:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error during top-up.' });
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
    const portfolios = portfoliosRaw.map(p => {
      const isCompounding = String(p.roi_mode) === 'monthly_compounding';
      const principal = Number(p.investment_amount);
      const rate = Number(p.roi_percentage) / 100;
      const duration = p.duration_months;
      
      const expectedProfit = isCompounding
        ? Math.floor(principal * Math.pow(1 + rate / 12, duration)) - principal
        : Math.floor(principal * rate * (duration / 12));

      const baseGrowth = (p.status === 'active' || p.status === 'ACTIVE') 
        ? Math.floor(expectedProfit / (duration * 30)) 
        : 0;
      
      const msElapsed = Date.now() - new Date(p.created_at).getTime();
      const daysElapsed = Math.floor(msElapsed / (1000 * 60 * 60 * 24));
      
      const accumulatedProfit = (p.status === 'active' || p.status === 'ACTIVE') 
        ? Math.min(daysElapsed * baseGrowth, expectedProfit) 
        : 0;

      const todayGrowth = daysElapsed >= 1 ? baseGrowth : 0;

      return {
        ...p,
        id: p.id,
        investedAmount: Number(p.investment_amount),
        portfolioCode: p.portfolio_code,
        assetName: p.account_name || `${p.duration_months}-Month ${String(p.roi_mode).toLowerCase().includes('compounding') ? 'Compounding' : 'Standard Yield'} Portfolio`,
        roiPercent: Number(p.roi_percentage),
        payoutType: String(p.roi_mode).toLowerCase().includes('compounding') ? 'Compounding' : 'Monthly',
        durationMonths: p.duration_months,
        totalEarned: Number(p.total_roi_earned) + accumulatedProfit,
        createdDate: new Date(p.created_at).toLocaleDateString(),
        nextPayoutDate: p.next_roi_date ? new Date(p.next_roi_date).toLocaleDateString() : '—',
        maturityDate: new Date(new Date(p.created_at).getTime() + p.duration_months * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        expectedAmount: expectedProfit,
        status: String(p.status).toLowerCase(),
        todayGrowth,
        virtualHouses: []
      };
    });

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

export const getPortfolioDetails = async (req: Request, res: Response) => {
  try {
    const funderId = req.user?.sub || req.user?.id;
    const { code } = req.params;

    const p = await prisma.investorPortfolios.findFirst({
      where: { portfolio_code: code, investor_id: funderId }
    });

    if (!p) {
      return res.status(404).json({ status: 'error', message: 'Portfolio not found.' });
    }

    const isCompounding = p.roi_mode === 'monthly_compounding';
    const principal = Number(p.investment_amount);
    const rate = Number(p.roi_percentage) / 100;
    const duration = p.duration_months;
    
    const expectedProfit = isCompounding
      ? Math.floor(principal * Math.pow(1 + rate / 12, duration)) - principal
      : Math.floor(principal * rate * (duration / 12));

    const baseGrowth = (p.status === 'active' || p.status === 'ACTIVE') 
      ? Math.floor(expectedProfit / (duration * 30)) 
      : 0;
    const msElapsed = Date.now() - new Date(p.created_at).getTime();
    const daysElapsed = Math.floor(msElapsed / (1000 * 60 * 60 * 24));
    
    const accumulatedProfit = (p.status === 'active' || p.status === 'ACTIVE') 
      ? Math.min(daysElapsed * baseGrowth, expectedProfit) 
      : 0;
      
    const todayGrowth = daysElapsed >= 1 ? baseGrowth : 0;

    const nextPayoutDate = p.next_roi_date ? new Date(p.next_roi_date) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const portfolioInfo = {
      assetName: p.account_name || `Portfolio ${p.portfolio_code}`,
      portfolioCode: p.portfolio_code,
      status: p.status,
      investedAmount: Number(p.investment_amount),
      totalEarned: Number(p.total_roi_earned) + accumulatedProfit,
      todayGrowth,
      roiMode: p.roi_mode === 'monthly_compounding' ? 'Monthly Compounding' : 'Monthly Payout',
      durationLeft: `${p.duration_months} Months`,
      nextPayout: nextPayoutDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      maturityDate: new Date(new Date(p.created_at).getTime() + p.duration_months * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      autoRenew: p.auto_renew,
      expectedTotal: expectedProfit
    };

    // Payout History
    const ledger = await prisma.generalLedger.findMany({
      where: { user_id: funderId, reference_id: p.portfolio_code },
      orderBy: { created_at: 'desc' }
    });
    const payoutHistory = ledger.map((l: any, i: number) => ({
      id: l.id || `tx-${i}`,
      date: new Date(l.created_at || l.transaction_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      amount: Number(l.amount),
      type: l.category === 'supporter_roi_payout' ? 'ROI Payout' : l.category.replace(/_/g, ' '),
      status: 'Completed'
    }));

    return res.status(200).json({
      status: 'success',
      data: {
        portfolioInfo,
        payoutHistory
      }
    });

  } catch (error) {
    console.error('getPortfolioDetails error:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getFunderReportsStats = async (req: Request, res: Response) => {
  try {
    const funderId = req.user?.sub || req.user?.id;
    const yearStr = req.query.year as string;
    const year = yearStr ? parseInt(yearStr) : new Date().getFullYear();

    // 1. Fetch all ROI payout/dividend transactions for Yield Growth
    const ledgers = await prisma.generalLedger.findMany({
      where: {
        user_id: funderId,
        category: { in: ['roi_payout', 'auto_compound', 'dividend', 'profit_share', 'capital_distribution'] },
        created_at: {
           gte: new Date(`${year}-01-01T00:00:00.000Z`).toISOString(),
           lt: new Date(`${year + 1}-01-01T00:00:00.000Z`).toISOString()
        }
      },
      orderBy: { created_at: 'asc' }
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const yieldData = months.map(m => ({ month: m, yield: 0 }));

    ledgers.forEach(tx => {
      const monthIdx = new Date(tx.created_at).getMonth();
      yieldData[monthIdx].yield += Number(tx.amount) || 0;
    });

    // Convert to cumulative array to map exponential growth correctly
    let runningTotal = 0;
    const cumulativeYieldData = yieldData.map(d => {
       runningTotal += d.yield;
       return { month: d.month, yield: runningTotal };
    });

    // 2. Fetch Portfolios for Asset Allocation
    const portfolios = await prisma.investorPortfolios.findMany({
      where: { investor_id: funderId, status: { in: ['active', 'ACTIVE'] } } // Only active capital
    });

    const allocationMap: Record<string, number> = {};
    let totalInvested = 0;
    
    portfolios.forEach(p => {
       const category = `${p.duration_months}MO ${p.roi_mode === 'monthly_compounding' ? 'Compound' : 'Yield'}`;
       allocationMap[category] = (allocationMap[category] || 0) + Number(p.investment_amount);
       totalInvested += Number(p.investment_amount);
    });

    const allocationData = Object.entries(allocationMap).map(([name, value]) => ({
       name,
       value: totalInvested > 0 ? Math.round((value / totalInvested) * 100) : 0
    })).filter(a => a.value > 0);

    // If completely empty, return a default Unallocated structure so PieChart renders correctly
    if (allocationData.length === 0) {
      allocationData.push({ name: 'Unallocated Capital', value: 100 });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        yieldData: cumulativeYieldData,
        allocationData,
        totalInvested,
        totalEarned: runningTotal
      }
    });

  } catch (error: any) {
    console.error('getFunderReportsStats error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to generate reporting metrics' });
  }
};
