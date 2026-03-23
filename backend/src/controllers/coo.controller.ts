import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';
import { problemResponse } from '../utils/problem';

export const getOverviewMetrics = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Simple YYYY-MM-DD prefix matcher for string dates

    // 1. Demographics
    const totalInvestors = await prisma.profiles.count({ where: { role: 'FUNDER', is_frozen: false } });
    const activeAgents = await prisma.profiles.count({ where: { role: 'AGENT', is_frozen: false } });
    const activeAccounts = await prisma.profiles.count({ where: { verified: true } });

    // 2. Portfolios (Total Investments)
    const portfolios = await prisma.investorPortfolios.aggregate({ _sum: { investment_amount: true } });
    const totalInvestments = portfolios._sum.investment_amount || 0;

    // 3. Collections (Daily)
    const collections = await prisma.agentCollections.aggregate({
      where: { created_at: { startsWith: today } },
      _sum: { amount: true }
    });
    const dailyCollections = collections._sum.amount || 0;

    // 4. Operations
    const visits = await prisma.agentVisits.count({
      where: { created_at: { startsWith: today } }
    });

    // 5. Risks
    // Missed payments: RentRequests that are DISBURSED but not fully repaid
    const disbursedRequests = await prisma.rentRequests.findMany({
      where: { status: 'DISBURSED' }
    });
    let missedPaymentsCount = 0;
    for (const req of disbursedRequests) {
        const totalRepayment = req.rent_amount + req.request_fee;
        if (req.amount_repaid < totalRepayment) {
            missedPaymentsCount++;
        }
    }

    // 6. Withdrawals
    const pendingWithdrawalsSum = await prisma.investmentWithdrawalRequests.aggregate({
      where: { status: 'manager_approved' },
      _sum: { amount: true }
    });
    const pendingWithdrawalsCount = await prisma.investmentWithdrawalRequests.count({
      where: { status: 'manager_approved' }
    });

    // 7. Wallet Monitoring
    const wallets = await prisma.wallets.aggregate({ _sum: { balance: true }});
    const mainFloat = wallets._sum.balance || 0;
    const agentEscrow = mainFloat * 0.12; // Static mock slice matching frontend for now

    res.json({
        totalInvestors,
        totalInvestments,
        dailyCollections,
        activeAgents,
        activeAccounts,
        todaysVisits: visits,
        missedPaymentsCount: missedPaymentsCount, // Using the computed value
        pendingWithdrawalsAmount: pendingWithdrawalsSum._sum.amount || 0,
        pendingWithdrawalsCount: pendingWithdrawalsCount,
        walletMonitoring: {
           mainFloat,
           agentEscrow
        }
    });
  } catch (error: any) {
    return problemResponse(res, 500, 'Internal Server Error', error.message, 'https://api.rentflow.com/errors/internal-error');
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.generalLedger.findMany({
      take: 100,
      orderBy: { transaction_date: 'desc' },
      select: {
        id: true,
        transaction_date: true,
        amount: true,
        direction: true,
        category: true,
        description: true,
        source_table: true
      }
    });

    res.json(transactions.map(t => ({
      ...t,
      status: 'completed'
    })));
  } catch (error: any) {
    return problemResponse(res, 500, 'Internal Server Error', error.message, 'https://api.rentflow.com/errors/internal-error');
  }
};

export const getCollections = async (req: Request, res: Response) => {
  try {
    const collections = await prisma.agentCollections.findMany({
      take: 100,
      orderBy: { created_at: 'desc' }
    });

    const agentIds = Array.from(new Set(collections.map(c => c.agent_id).filter(id => id)));
    let agentMap = new Map();
    if (agentIds.length > 0) {
      const agents = await prisma.profiles.findMany({ where: { id: { in: agentIds as string[] } } });
      agentMap = new Map(agents.map(a => [a.id, a.full_name]));
    }

    res.json(collections.map(c => ({
      id: c.id,
      amount: c.amount,
      createdAt: c.created_at,
      paymentMethod: c.payment_method,
      notes: c.notes,
      agentName: c.agent_id ? agentMap.get(c.agent_id) || 'Unknown' : 'Unknown'
    })));
  } catch (error: any) {
    return problemResponse(res, 500, 'Internal Server Error', error.message, 'https://api.rentflow.com/errors/internal-error');
  }
};

export const getWallets = async (req: Request, res: Response) => {
  try {
    const wallets = await prisma.wallets.findMany({
      take: 100,
      orderBy: { balance: 'desc' }
    });

    const userIds = Array.from(new Set(wallets.map(w => w.user_id).filter(id => id)));
    let userMap = new Map();
    if (userIds.length > 0) {
      const users = await prisma.profiles.findMany({ where: { id: { in: userIds as string[] } } });
      userMap = new Map(users.map(u => [u.id, u]));
    }

    res.json(wallets.map(w => {
      const u = w.user_id ? userMap.get(w.user_id) : null;
      return {
        id: w.id,
        balance: w.balance,
        updatedAt: w.updated_at,
        userName: u ? u.full_name : 'System Account',
        role: u ? u.role : 'SYSTEM'
      };
    }));
  } catch (error: any) {
    return problemResponse(res, 500, 'Internal Server Error', error.message, 'https://api.rentflow.com/errors/internal-error');
  }
};

export const getWithdrawals = async (req: Request, res: Response) => {
  try {
    const requests = await prisma.withdrawalRequests.findMany({
      where: { status: 'manager_approved' },
      orderBy: { created_at: 'asc' }
    });

    res.json(requests);
  } catch (error: any) {
    return problemResponse(res, 500, 'Internal Server Error', error.message, 'https://api.rentflow.com/errors/internal-error');
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    res.json({
      revenueTrends: [
        { month: 'Jan', value: 1200000 },
        { month: 'Feb', value: 1900000 },
        { month: 'Mar', value: 2400000 }
      ],
      paymentMethods: [
        { name: 'Mobile Money', value: 65 },
        { name: 'Bank Transfer', value: 28 },
        { name: 'Cash', value: 7 }
      ]
    });
  } catch (error: any) {
    return problemResponse(res, 500, 'Internal Server Error', error.message, 'https://api.rentflow.com/errors/internal-error');
  }
};

export const getPartners = async (req: Request, res: Response) => {
  try {
    const escalations = await prisma.partnerEscalations.findMany({
      take: 50,
      orderBy: { created_at: 'desc' }
    });

    res.json(escalations);
  } catch (error: any) {
    return problemResponse(res, 500, 'Internal Server Error', error.message, 'https://api.rentflow.com/errors/internal-error');
  }
};

export const getTenants = async (req: Request, res: Response) => {
  try {
    const subCharges = await prisma.subscriptionCharges.findMany({
      where: { status: 'FAILED' },
      take: 100,
      orderBy: { created_at: 'desc' }
    });
    
    res.json(subCharges);
  } catch (error: any) {
    return problemResponse(res, 500, 'Internal Server Error', error.message, 'https://api.rentflow.com/errors/internal-error');
  }
};

export const getAlerts = async (req: Request, res: Response) => {
  try {
    const events = await prisma.systemEvents.findMany({
      take: 50,
      orderBy: { created_at: 'desc' }
    });
    
    // Schema Translator Bridge: Align active AWS schema with the Frontend React component requirements
    const mapped = events.map((e: any) => {
        let severity = 'MEDIUM';
        const typeStr = (e.event_type || '').toLowerCase();
        if (typeStr.includes('failed') || typeStr.includes('error')) severity = 'HIGH';
        else if (typeStr.includes('created') || typeStr.includes('success')) severity = 'LOW';
        
        return {
            id: e.id,
            type: e.event_type ? e.event_type.replace(/_/g, ' ').toUpperCase() : 'SYSTEM EVENT',
            source: e.related_entity_type ? e.related_entity_type.toUpperCase() : 'SYSTEM_LOG',
            description: `Automated event triggered: ${e.event_type}. Associated Entity: ${e.related_entity_id}`,
            severity: severity,
            created_at: e.created_at
        };
    });

    res.json(mapped);
  } catch (error: any) {
    return problemResponse(res, 500, 'Internal Server Error', error.message, 'https://api.rentflow.com/errors/internal-error');
  }
};

export const getStaff = async (req: Request, res: Response) => {
  try {
    const users = await prisma.profiles.findMany({
      where: {
        role: { in: ['AGENT', 'MANAGER', 'SUPPORT', 'COO', 'CFO', 'CEO'] },
        is_frozen: false
      },
      select: {
        id: true, full_name: true, role: true, territory: true
      }
    });

    const mapped = users.map(u => ({
      id: u.id,
      name: u.full_name,
      role: u.role || 'Staff',
      dept: u.territory || 'HQ',
      metricTitle: 'Activity Score',
      metricValue: '98%',
      status: 'Active'
    }));

    res.json({ staff: mapped });
  } catch (error: any) {
    return problemResponse(res, 500, 'Internal Server Error', error.message, 'https://api.rentflow.com/errors/internal-error');
  }
};

export const createOpportunity = async (req: Request, res: Response) => {
  try {
    const { name, location, image_url, rent_required, bedrooms, status } = req.body;
    
    if (!name || !location || !rent_required || !bedrooms) {
        return problemResponse(res, 400, 'Validation Error', 'Missing required fields for Funder marketplace', 'https://api.rentflow.com/errors/validation-error');
    }

    const now = new Date().toISOString();

    const newOpportunity = await prisma.virtualOpportunities.create({
      data: {
        name,
        location,
        image_url,
        rent_required: Number(rent_required),
        bedrooms: Number(bedrooms),
        status: status || 'available',
        created_at: now,
        updated_at: now
      }
    });

    return res.status(201).json({ status: 'success', data: newOpportunity });
  } catch (error: any) {
    console.error('Failed to create virtual opportunity', error);
    return problemResponse(res, 500, 'Internal Server Error', error.message || 'Failed to process opportunity creation', 'https://api.rentflow.com/errors/internal-error');
  }
};

export const getOpportunities = async (req: Request, res: Response) => {
  try {
    const cursor = req.query.cursor as string | undefined;
    const limit = parseInt((req.query.limit as string) || '20', 10);
    const take = Math.min(limit, 100);

    const ops = await prisma.virtualOpportunities.findMany({
      take: take + 1, // Fetch one extra to determine 'has_more'
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { created_at: 'desc' }
    });

    const has_more = ops.length > take;
    const data = has_more ? ops.slice(0, -1) : ops;
    const next_cursor = has_more ? data[data.length - 1].id : null;

    return res.status(200).json({
      data,
      pagination: {
        next_cursor,
        has_more
      }
    });
  } catch (error: any) {
    console.error('Failed to fetch virtual opportunities', error);
    return problemResponse(res, 500, 'Internal Server Error', error.message || 'Failed to list opportunities', 'https://api.rentflow.com/errors/internal-error');
  }
};
