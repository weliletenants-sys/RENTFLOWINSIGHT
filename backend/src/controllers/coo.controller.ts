import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';
import { problemResponse } from '../utils/problem';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const getOverviewMetrics = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Simple YYYY-MM-DD prefix matcher for string dates

    // 1. Demographics
    const totalInvestors = await prisma.profiles.count({ where: { role: { in: ['FUNDER', 'funder', 'SUPPORTER', 'supporter'] }, is_frozen: false } });
    const activeAgents = await prisma.profiles.count({ where: { role: { in: ['AGENT', 'agent', 'partner'] }, is_frozen: false } });
    const activeAccounts = await prisma.profiles.count({ where: { verified: true } });
    const pendingAccounts = await prisma.profiles.count({ where: { verified: false } });

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
        pendingAccounts,
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
    // 1. Fetch Payment Methods Breakthrough
    const collections = await prisma.agentCollections.groupBy({
      by: ['payment_method'],
      _count: { payment_method: true },
      _sum: { amount: true }
    });

    const totalCollectionsDesc = await prisma.agentCollections.aggregate({ _count: true });
    const totalCount = totalCollectionsDesc._count || 1;

    const paymentMethods = collections.map(c => ({
      name: c.payment_method || 'Unknown',
      value: Math.round((c._count.payment_method / totalCount) * 100)
    }));

    if (paymentMethods.length === 0) {
       paymentMethods.push({ name: 'Awaiting Data', value: 100 });
    }

    // 2. Fetch trailing Revenue Trends (Last 3 months approximation via Collections)
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);

    const recentCollections = await prisma.agentCollections.findMany({
      where: { created_at: { gte: threeMonthsAgo.toISOString() } },
      select: { amount: true, created_at: true }
    });

    const monthlyAggregation: Record<string, number> = {};
    recentCollections.forEach(c => {
       const date = new Date(c.created_at);
       const monthName = date.toLocaleString('default', { month: 'short' });
       if (!monthlyAggregation[monthName]) monthlyAggregation[monthName] = 0;
       monthlyAggregation[monthName] += c.amount;
    });

    const revenueTrends = Object.keys(monthlyAggregation).map(month => ({
       month,
       value: monthlyAggregation[month]
    }));

    if (revenueTrends.length === 0) {
       revenueTrends.push(
          { month: 'Prev', value: 0 },
          { month: 'Curr', value: 0 }
       );
    }

    // Collection growth comparison
    const collectionGrowth = revenueTrends.length >= 2 
        ? Math.round(((revenueTrends[revenueTrends.length - 1].value - revenueTrends[revenueTrends.length - 2].value) / (revenueTrends[revenueTrends.length - 2].value || 1)) * 100)
        : 0;

    res.json({
      revenueTrends,
      paymentMethods,
      collectionGrowth,
      topProvider: 'MTN Mobile Money'
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
    }).catch(() => []); // Fallback safety

    // Fetch live FUNDERS from the profiles registry
    const funders = await prisma.profiles.findMany({
      where: { role: 'FUNDER' },
      select: { id: true, full_name: true, is_frozen: true }
    });

    // Compute aggregated metrics for each structural Partner (Funder)
    const investors = await Promise.all(funders.map(async f => {
      const ports = await prisma.investorPortfolios.findMany({
         where: { investor_id: f.id }
      });
      
      const totalInvested = ports.reduce((sum: number, p: any) => sum + Number(p.investment_amount || p.investmentAmount || 0), 0);
      const activeDeals = ports.filter((p: any) => (p.status || '').toUpperCase() === 'ACTIVE').length;
      const returnsPaid = ports.reduce((sum: number, p: any) => sum + Number(p.total_roi_earned || p.totalRoiEarned || 0), 0);
      
      const wallet = await prisma.wallets.findFirst({ where: { user_id: f.id } });
      let walletBalance = 0;
      if (wallet) {
         const bucket = await prisma.walletBuckets.findFirst({ where: { wallet_id: wallet.id, bucket_type: 'available' } });
         walletBalance = bucket ? Number(bucket.balance) : Math.max(0, Number(wallet.balance || 0) - totalInvested);
      }

      return {
         id: f.id,
         name: f.full_name || 'Unnamed Partner',
         frozen: f.is_frozen || false,
         totalInvested,
         returnsPaid,
         activeDeals,
         walletBalance,
         portfolios: ports
      };
    }));

    res.json({ escalations, investors });
  } catch (error: any) {
    return problemResponse(res, 500, 'Internal Server Error', error.message, 'https://api.rentflow.com/errors/internal-error');
  }
};

export const getTenants = async (req: Request, res: Response) => {
  try {
    const subCharges = await prisma.subscriptionCharges.findMany({
      take: 100,
      orderBy: { created_at: 'desc' }
    });

    // Relational Identity Mapping: Lookup actual Tenant profile names
    const userIds = Array.from(new Set(subCharges.map((c: any) => c.tenant_id || c.user_id).filter((id: any) => id)));
    let userMap = new Map();
    if (userIds.length > 0) {
      const users = await prisma.profiles.findMany({ where: { id: { in: userIds as string[] } } });
      userMap = new Map(users.map((u: any) => [u.id, u]));
    }
    
    // Bridge the live DB telemetry solidly to the explicit React format
    const mapped = subCharges.map((charge: any) => {
      const uid = charge.tenant_id || charge.user_id;
      const tenant = userMap.get(uid);
      return {
        id: charge.id,
        user_id: uid || 'UNKNOWN',
        tenantName: tenant ? (tenant.full_name || 'Unknown User') : 'Unknown User',
        tenantPhone: tenant ? (tenant.phone_number || 'No Phone') : 'No Phone',
        amount: charge.charge_amount || charge.rent_amount || charge.expected_rent || 0,
        status: charge.status || 'PENDING',
        created_at: charge.created_at
      };
    });

    res.json(mapped);
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

export const getGlobalUsersList = async (req: Request, res: Response) => {
  try {
    const cursor = req.query.cursor as string | undefined;
    const limit = parseInt((req.query.limit as string) || '100', 10);
    const search = req.query.search as string | undefined;
    const role = req.query.role as string | undefined;
    const status = req.query.status as string | undefined;

    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { full_name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (role && role !== 'ALL') {
      whereClause.role = role.toUpperCase();
    }
    
    if (status && status !== 'ALL') {
      whereClause.verified = status === 'VERIFIED';
    }

    const take = Math.min(limit, 100);

    const users = await prisma.profiles.findMany({
      take: take + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      where: whereClause,
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        role: true,
        created_at: true,
        is_frozen: true,
        verified: true
      },
      orderBy: { created_at: 'desc' }
    });
    
    const has_more = users.length > take;
    const data = has_more ? users.slice(0, -1) : users;
    const next_cursor = has_more ? data[data.length - 1].id : null;

    return res.status(200).json({ 
      status: 'success', 
      data: { users: data },
      pagination: { has_more, next_cursor }
    });
  } catch (error: any) {
    console.error('Error fetching global users:', error);
    return problemResponse(res, 500, 'Internal Server Error', `Could not fetch global users: ${error.message} \n ${error.stack}`, 'internal-error');
  }
};

export const deleteGlobalUsers = async (req: Request, res: Response) => {
  try {
    const { userIds } = req.body;
    
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return problemResponse(res, 400, 'Bad Request', 'An array of userIds must be provided', 'invalid-parameters');
    }

    const result = await prisma.profiles.deleteMany({
      where: {
        id: { in: userIds }
      }
    });

    return res.status(200).json({ status: 'success', data: { deleted_count: result.count } });
  } catch (error: any) {
    console.error('Failed to bulk delete users:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Could not delete user records', 'internal-error');
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.profiles.findUnique({
      where: { id }
    });

    if (!user) {
      return problemResponse(res, 404, 'Not Found', 'User identity not found', 'resource-not-found');
    }

    // Scrub password hash if present in schema, although findUnique typically maps directly.
    return res.status(200).json({ status: 'success', data: { user } });
  } catch (error: any) {
    console.error('Failed to fetch user profile:', error);
    return problemResponse(res, 500, 'Internal Server Error', 'Failed to retrieve profile record', 'internal-error');
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { full_name, email, phone, role, verified, is_frozen } = req.body;

    const updateData: any = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (role !== undefined) updateData.role = role || null;
    if (verified !== undefined) updateData.verified = verified;
    if (is_frozen !== undefined) updateData.is_frozen = is_frozen;

    const updatedUser = await prisma.profiles.update({
      where: { id },
      data: updateData
    });

    return res.status(200).json({ status: 'success', data: { user: updatedUser } });
  } catch (error: any) {
    console.error('Failed to update user profile:', error);
    if (error.code === 'P2025') {
      return problemResponse(res, 404, 'Not Found', 'User identity not found', 'resource-not-found');
    }
    return problemResponse(res, 500, 'Internal Server Error', 'Failed to update user profile details', 'internal-error');
  }
};

// --- Deposit Review & Forwarding (Multi-Stage Approval Pipeline) ---

export const getPendingDeposits = async (req: Request, res: Response) => {
  try {
    const deposits = await prisma.depositRequests.findMany({
      where: { status: 'PENDING' },
      orderBy: { created_at: 'desc' }
    });

    const enriched = await Promise.all(deposits.map(async d => {
      let profile = null;
      if (d.user_id) profile = await prisma.profiles.findUnique({ where: { id: d.user_id } });
      return {
        ...d,
        user_name: profile?.full_name || 'Unknown',
        user_phone: profile?.phone || 'Unknown',
        avatar_url: profile?.avatar_url || null
      };
    }));

    res.json({ deposits: enriched });
  } catch (error: any) {
    return problemResponse(res, 500, 'Internal Server Error', error.message, 'internal-error');
  }
};

export const forwardDeposit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cooId = req.user?.sub;

    const request = await prisma.depositRequests.findUnique({ where: { id } });
    if (!request) return problemResponse(res, 404, 'Not Found', `Deposit not found`, 'not-found');
    if (request.status?.toUpperCase() !== 'PENDING') return problemResponse(res, 400, 'Validation Error', `Deposit is not pending`, 'validation-error');

    const updated = await prisma.depositRequests.update({
      where: { id },
      data: {
        status: 'COO_APPROVED',
        // @ts-ignore - Bypass local Prisma lock typecheck
        coo_id: cooId,
        // @ts-ignore
        coo_approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });

    res.json({ message: 'Deposit successfully forwarded to CFO queue', request: updated });
  } catch (error: any) {
    return problemResponse(res, 500, 'Internal Server Error', error.message, 'internal-error');
  }
};

export const rejectDeposit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const cooId = req.user?.sub;

    if (!reason || reason.trim() === '') {
      return problemResponse(res, 400, 'Validation Error', `Rejection reason is required`, 'validation-error');
    }

    const updated = await prisma.depositRequests.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejection_reason: reason,
        processed_by: cooId,
        updated_at: new Date().toISOString()
      }
    });

    res.json({ message: 'Deposit rejected', request: updated });
  } catch (error: any) {
    return problemResponse(res, 500, 'Internal Server Error', error.message, 'internal-error');
  }
};

// --- Portfolio Management ---

export const updatePortfolio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { investment_amount, total_roi_earned, status } = req.body;

    const data: any = { updated_at: new Date().toISOString() };
    if (investment_amount !== undefined) data.investment_amount = Number(investment_amount);
    if (total_roi_earned !== undefined) data.total_roi_earned = Number(total_roi_earned);
    if (status !== undefined) data.status = status;

    const updated = await prisma.investorPortfolios.update({
      where: { id },
      data
    });

    res.json({ message: 'Portfolio updated successfully', portfolio: updated });
  } catch (error: any) {
    if (error.code === 'P2025') {
       return problemResponse(res, 404, 'Not Found', 'Portfolio record not found', 'not-found');
    }
    return problemResponse(res, 500, 'Internal Server Error', error.message, 'internal-error');
  }
};

export const validatePartnersImport = async (req: Request, res: Response) => {
  try {
    const { partners } = req.body;
    if (!Array.isArray(partners)) return problemResponse(res, 400, "Validation Error", "partners must be an array", "import-validation");

    const groupsMap = new Map<string, any>();
    
    for (const p of partners) {
       const key = p.phone || p.email || p.name;
       if (!groupsMap.has(key)) {
          groupsMap.set(key, {
             name: p.name || 'Unknown Partner',
             phone: p.phone,
             email: p.email,
             portfolios: []
          });
       }
       groupsMap.get(key).portfolios.push({
          amount: Number(p.amount) || 0,
          roi: Number(p.roi) || 15,
          duration: Number(p.duration) || 12,
          date: p.date,
          roiMode: p.roiMode
       });
    }

    const groups = Array.from(groupsMap.values());
    let newPartnersCount = 0;
    let existingCount = 0;
    let portfolioCount = 0;
    let totalCapital = 0;

    for (const g of groups) {
       let user = null;
       if (g.phone || g.email) {
          user = await prisma.profiles.findFirst({
            where: g.phone && g.email 
              ? { OR: [{ phone: g.phone }, { email: g.email }] }
              : g.phone ? { phone: g.phone } : { email: g.email }
          });
       }
       
       if (user) {
          g.existing = true;
          existingCount++;
       } else {
          g.existing = false;
          newPartnersCount++;
       }

       portfolioCount += g.portfolios.length;
       for (const port of g.portfolios) {
          totalCapital += port.amount;
       }
    }

    return res.status(200).json({
       status: 'success',
       data: {
          summary: {
             newPartners: newPartnersCount,
             existing: existingCount,
             portfolios: portfolioCount,
             totalCapital: totalCapital,
             errors: 0
          },
          groups
       }
    });

  } catch (error: any) {
    return problemResponse(res, 500, "Internal Server Error", error.message, "internal-error");
  }
};


export const importPartners = async (req: Request, res: Response) => {
  try {
    const { partners } = req.body;
    if (!Array.isArray(partners)) return problemResponse(res, 400, "Validation Error", "partners must be an array", "import-validation");

    let importedCount = 0;
    let portfolioCount = 0;

    const defaultPasswordHash = await bcrypt.hash('Partner@welile', 12);

    for (const p of partners) {
      if (!p.phone && !p.email) continue;
      
      let user = await prisma.profiles.findFirst({
        where: p.phone && p.email 
          ? { OR: [{ phone: p.phone }, { email: p.email }] }
          : p.phone ? { phone: p.phone } : { email: p.email }
      });

      if (!user) {
        user = await prisma.profiles.create({
          data: {
            full_name: p.name || 'Unnamed Partner',
            phone: p.phone || `mock_${crypto.randomUUID().slice(0, 8)}`,
            email: p.email || null,
            role: 'FUNDER',
            password_hash: defaultPasswordHash,
            verified: true,
            is_frozen: false,
            rent_discount_active: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        });
        importedCount++;
      } else if (user.role !== 'FUNDER') {
         await prisma.profiles.update({ where: { id: user.id }, data: { role: 'FUNDER' }});
      }

      let wallet = await prisma.wallets.findFirst({ where: { user_id: user.id } });
      if (!wallet) {
        wallet = await prisma.wallets.create({
          data: {
            user_id: user.id,
            balance: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        });
      }

      const amount = Number(p.amount) || 0;
      if (amount <= 0) continue;

      const duration = Number(p.duration) || 12;
      const createdDate = p.date ? new Date(p.date) : new Date();
      
      // Calculate future-proof next_roi_date
      const now = new Date();
      const maturityDate = new Date(createdDate.getTime());
      maturityDate.setMonth(maturityDate.getMonth() + duration);

      let nextMonth = new Date(createdDate.getTime());
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      // Fast-forward next payout date to the future (if importing legacy dates)
      // but do not exceed maturity date
      while (nextMonth < now && nextMonth < maturityDate) {
        nextMonth.setMonth(nextMonth.getMonth() + 1);
      }

      const portfolio = await prisma.investorPortfolios.create({
        data: {
          investor_id: user.id,
          activation_token: crypto.randomUUID(),
          created_at: createdDate.toISOString(),
          portfolio_code: `WPF-IMP-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
          investment_amount: amount,
          portfolio_pin: Math.floor(1000 + Math.random() * 9000).toString(),
          total_roi_earned: 0,
          roi_percentage: Number(p.roi) || 15,
          roi_mode: p.roiMode || 'monthly_compounding',
          duration_months: duration,
          auto_renew: false,
          status: 'active',
          next_roi_date: nextMonth.toISOString()
        }
      });
      portfolioCount++;

      let investedBucket = await prisma.walletBuckets.findFirst({
        where: { wallet_id: wallet.id, bucket_type: 'invested' }
      });

      if (investedBucket) {
        await prisma.walletBuckets.update({
          where: { id: investedBucket.id },
          data: { balance: { increment: amount }, updated_at: new Date() }
        });
      } else {
        await prisma.walletBuckets.create({
          data: { wallet_id: wallet.id, bucket_type: 'invested', balance: amount }
        });
      }

      await prisma.wallets.update({
        where: { id: wallet.id },
        data: { balance: { increment: amount }, updated_at: new Date().toISOString() }
      });

      await prisma.generalLedger.create({
        data: {
          user_id: user.id,
          amount: amount,
          direction: 'cash_in',
          category: 'coo_manual_portfolio',
          transaction_date: createdDate.toISOString(),
          created_at: new Date().toISOString(),
          source_table: 'investor_portfolios',
          reference_id: portfolio.portfolio_code
        }
      });
    }

    return res.status(200).json({ status: 'success', data: { importedCount, portfolioCount } });
  } catch (error: any) {
    console.error("importPartners Error", error);
    return problemResponse(res, 500, "Internal Server Error", error.message, "internal-error");
  }
};

export const createManualPortfolio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Funder ID
    const { amount, roi, duration, date, roiMode } = req.body;
    
    if (!amount || Number(amount) <= 0) return problemResponse(res, 400, "Validation Error", "Amount is required", "manual-validation");

    let wallet = await prisma.wallets.findFirst({ where: { user_id: id } });
    if (!wallet) {
      wallet = await prisma.wallets.create({
        data: { user_id: id, balance: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      });
    }

    const createdDate = date ? new Date(date) : new Date();
    
    // Calculate future-proof next_roi_date
    const now = new Date();
    const maturityDate = new Date(createdDate.getTime());
    maturityDate.setMonth(maturityDate.getMonth() + Number(duration));

    let nextMonth = new Date(createdDate.getTime());
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    // Fast-forward next payout date to the future (if creating legacy dates)
    while (nextMonth < now && nextMonth < maturityDate) {
      nextMonth.setMonth(nextMonth.getMonth() + 1);
    }

    const portfolio = await prisma.investorPortfolios.create({
        data: {
          investor_id: id,
          activation_token: crypto.randomUUID(),
          created_at: createdDate.toISOString(),
          portfolio_code: `WPF-MAN-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
          investment_amount: Number(amount),
          portfolio_pin: Math.floor(1000 + Math.random() * 9000).toString(),
          total_roi_earned: 0,
          roi_percentage: Number(roi) || 15,
          roi_mode: roiMode || 'monthly_compounding',
          duration_months: Number(duration) || 12,
          auto_renew: false,
          status: 'active',
          next_roi_date: nextMonth.toISOString()
        }
    });

    let investedBucket = await prisma.walletBuckets.findFirst({
        where: { wallet_id: wallet.id, bucket_type: 'invested' }
    });

    if (investedBucket) {
        await prisma.walletBuckets.update({
          where: { id: investedBucket.id },
          data: { balance: { increment: Number(amount) }, updated_at: new Date() }
        });
    } else {
        await prisma.walletBuckets.create({
          data: { wallet_id: wallet.id, bucket_type: 'invested', balance: Number(amount) }
        });
    }

    await prisma.wallets.update({
        where: { id: wallet.id },
        data: { balance: { increment: Number(amount) }, updated_at: new Date().toISOString() }
    });

    await prisma.generalLedger.create({
        data: {
          user_id: id,
          amount: Number(amount),
          direction: 'cash_in',
          category: 'coo_manual_portfolio',
          transaction_date: createdDate.toISOString(),
          created_at: new Date().toISOString(),
          source_table: 'investor_portfolios',
          reference_id: portfolio.portfolio_code
        }
    });

    return res.status(200).json({ status: 'success', data: { portfolio } });
  } catch (error: any) {
    console.error("createManualPortfolio Error", error);
    return problemResponse(res, 500, "Internal Server Error", error.message, "internal-error");
  }
};

export const investForPartner = async (req: Request, res: Response) => {
  try {
    const funderId = req.params.id;
    const { amount, duration_months = 12, roi_mode = 'monthly_compounding', auto_renew = false } = req.body;

    if (!amount || Number(amount) < 100000) {
      return problemResponse(res, 400, "Validation Error", "Minimum investment amount is 100,000 UGX", "proxy-validation");
    }

    const wallet = await prisma.wallets.findFirst({ where: { user_id: funderId } });
    if (!wallet) return problemResponse(res, 404, "Not Found", "Wallet not found", "proxy-not-found");

    const availableBucket = await prisma.walletBuckets.findFirst({
      where: { wallet_id: wallet.id, bucket_type: 'available' }
    });

    if (!availableBucket || availableBucket.balance < Number(amount)) {
      return problemResponse(res, 400, "Validation Error", "Insufficient liquid available balance in partner wallet.", "proxy-insufficient-funds");
    }

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

    await prisma.generalLedger.create({
      data: {
        user_id: funderId,
        amount: Number(amount),
        direction: 'cash_out',
        category: 'coo_proxy_investment',
        transaction_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        source_table: 'wallet_buckets',
        reference_id: `PROXY${new Date().getTime().toString().slice(-6)}`
      }
    });

    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);

    const portfolio = await prisma.investorPortfolios.create({
      data: {
        investor_id: funderId,
        activation_token: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        portfolio_code: `WPF-PROXY-${new Date().getTime().toString().slice(-4)}`,
        investment_amount: Number(amount),
        portfolio_pin: Math.floor(1000 + Math.random() * 9000).toString(),
        total_roi_earned: 0,
        roi_percentage: 15,
        roi_mode: String(roi_mode),
        duration_months: Number(duration_months),
        auto_renew: Boolean(auto_renew),
        status: 'active',
        next_roi_date: nextMonth.toISOString()
      }
    });

    return res.status(200).json({ status: 'success', data: portfolio, message: 'Successfully funded the rent pool proxy.' });
  } catch (error: any) {
    console.error('investForPartner error:', error);
    return problemResponse(res, 500, "Internal Server Error", error.message, "internal-error");
  }
};

export const fundPartnerWallet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, sourceReference, reason } = req.body;
    
    if (!amount || amount <= 0) return problemResponse(res, 400, "Validation Error", "Valid amount required", "wallet-validation");
    if (!reason || reason.trim().length < 10) return problemResponse(res, 400, "Validation Error", "Valid audit reason required", "wallet-validation");

    let wallet = await prisma.wallets.findFirst({ where: { user_id: id } });
    if (!wallet) {
      wallet = await prisma.wallets.create({
        data: { user_id: id, balance: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      });
    }

    let availableBucket = await prisma.walletBuckets.findFirst({
        where: { wallet_id: wallet.id, bucket_type: 'available' }
    });

    if (availableBucket) {
        await prisma.walletBuckets.update({
          where: { id: availableBucket.id },
          data: { balance: { increment: Number(amount) }, updated_at: new Date() }
        });
    } else {
        await prisma.walletBuckets.create({
          data: { wallet_id: wallet.id, bucket_type: 'available', balance: Number(amount) }
        });
    }

    await prisma.wallets.update({
        where: { id: wallet.id },
        data: { balance: { increment: Number(amount) }, updated_at: new Date().toISOString() }
    });

    await prisma.generalLedger.create({
        data: {
          user_id: id,
          amount: Number(amount),
          direction: 'cash_in',
          category: 'coo_wallet_fund',
          transaction_date: new Date().toISOString(),
          description: `Manual funding by Admin ${req.user?.id || 'Unknown'}. Reason: ${reason}. Ref: ${sourceReference}`,
          source_table: 'wallets',
          created_at: new Date().toISOString()
        }
    });

    res.json({ message: 'Wallet funded' });
  } catch (error: any) {
    return problemResponse(res, 500, "Internal Server Error", error.message, "internal-error");
  }
};

export const suspendPartnerAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    if (!reason || reason.trim().length < 10) return problemResponse(res, 400, "Validation Error", "Valid audit reason required", "suspend-validation");

    await prisma.profiles.update({
      where: { id },
      data: { is_frozen: true, frozen_at: new Date().toISOString(), frozen_reason: reason }
    });

    await prisma.systemEvents.create({
      data: {
        event_type: 'partner_suspended',
        related_entity_type: 'profile',
        related_entity_id: id,
        user_id: req.user?.id,
        metadata: { description: `Partner suspended by Admin. Reason: ${reason}` },
        created_at: new Date().toISOString()
      }
    });

    res.json({ message: 'Partner suspended' });
  } catch (error: any) {
    return problemResponse(res, 500, "Internal Server Error", error.message, "internal-error");
  }
};

export const topUpPortfolio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Portfolio ID
    const { amount, source, reason } = req.body;
    
    if (!amount || amount <= 0) return problemResponse(res, 400, "Validation Error", "Valid amount required", "topup-validation");
    if (!reason || reason.trim().length < 10) return problemResponse(res, 400, "Validation Error", "Valid audit reason required", "topup-validation");

    const portfolio = await prisma.investorPortfolios.findUnique({ where: { id } });
    if (!portfolio) return problemResponse(res, 404, "Not Found", "Portfolio not found", "not-found");

    if (source === 'wallet') {
      const wallet = await prisma.wallets.findFirst({ where: { user_id: portfolio.investor_id } });
      if (!wallet || wallet.balance < amount) {
        return problemResponse(res, 400, "Validation Error", "Insufficient wallet balance", "topup-validation");
      }
      await prisma.wallets.update({
        where: { id: wallet.id },
        data: { balance: { decrement: Number(amount) }, updated_at: new Date().toISOString() }
      });
    }

    await prisma.investorPortfolios.update({
      where: { id },
      data: { investment_amount: { increment: Number(amount) } }
    });

    await prisma.generalLedger.create({
      data: {
        user_id: portfolio.investor_id,
        amount: Number(amount),
        direction: 'cash_in',
        category: 'coo_portfolio_topup',
        description: `Top-up from ${source} by Admin ${req.user?.id || 'Unknown'}. Reason: ${reason}`,
        transaction_date: new Date().toISOString(),
        source_table: 'investor_portfolios',
        reference_id: portfolio.id,
        created_at: new Date().toISOString()
      }
    });

    res.json({ message: 'Portfolio topped up' });
  } catch (error: any) {
    return problemResponse(res, 500, "Internal Server Error", error.message, "internal-error");
  }
};

export const renewPortfolio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const portfolio = await prisma.investorPortfolios.findUnique({ where: { id } });
    if (!portfolio) return problemResponse(res, 404, "Not Found", "Portfolio not found", "not-found");

    const nextDate = new Date(portfolio.next_roi_date || new Date());
    nextDate.setMonth(nextDate.getMonth() + 12);

    await prisma.investorPortfolios.update({
      where: { id },
      data: { duration_months: { increment: 12 }, total_roi_earned: 0, next_roi_date: nextDate.toISOString() }
    });

    await prisma.systemEvents.create({
      data: {
        event_type: 'portfolio_renewed',
        related_entity_type: 'portfolio',
        related_entity_id: id,
        user_id: req.user?.id,
        metadata: { description: `Portfolio renewed for 12 months by Admin.` },
        created_at: new Date().toISOString()
      }
    });

    res.json({ message: 'Portfolio renewed' });
  } catch (error: any) {
    return problemResponse(res, 500, "Internal Server Error", error.message, "internal-error");
  }
};

export const deletePortfolio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const portfolio = await prisma.investorPortfolios.findUnique({ where: { id } });
    if (!portfolio) {
      return problemResponse(res, 404, "Not Found", "Portfolio not found", "not-found");
    }

    await prisma.investorPortfolios.delete({
      where: { id }
    });

    await prisma.systemEvents.create({
      data: {
        event_type: 'portfolio_deleted',
        related_entity_type: 'portfolio',
        related_entity_id: id,
        user_id: req.user?.id,
        metadata: { description: `Portfolio ${id} was deleted by Admin.` },
        created_at: new Date().toISOString()
      }
    });

    res.json({ message: 'Portfolio successfully deleted' });
  } catch (error: any) {
    return problemResponse(res, 500, "Internal Server Error", error.message, "internal-error");
  }
};
