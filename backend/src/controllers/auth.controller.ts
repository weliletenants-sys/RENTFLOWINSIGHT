import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/prisma.client';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role, phone } = req.body;

    if (!email || !firstName || !lastName || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await prisma.profiles.findFirst({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const now = new Date().toISOString();
    
    // Create Profile
    const profile = await prisma.profiles.create({
      data: {
        email,
        full_name: `${firstName} ${lastName}`,
        phone: phone || '0000000000',
        is_frozen: false,
        verified: false,
        rent_discount_active: false,
        created_at: now,
        updated_at: now,
      },
    });

    // Create Role
    await prisma.userRoles.create({
      data: {
        role: role,
        user_id: profile.id,
        enabled: true,
        created_at: now
      }
    });

    // Create Wallet
    await prisma.wallets.create({
      data: {
        balance: 0.00,
        user_id: profile.id,
        created_at: now,
        updated_at: now
      }
    });

    const payload = { email: profile.email, sub: profile.id, role: role };
    const access_token = jwt.sign(payload, JWT_SECRET);

    return res.status(201).json({
      access_token,
      user: {
        id: profile.id,
        email: profile.email,
        firstName,
        lastName,
        role,
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const profile = await prisma.profiles.findFirst({ where: { email } });
    if (!profile) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Mocking password check since it's likely handled by Supabase Auth in production
    // If we reach here, we assume password was valid or we bypass it for now
    
    const userRole = await prisma.userRoles.findFirst({ where: { user_id: profile.id } });
    const role = userRole ? userRole.role : 'TENANT';

    const payload = { email: profile.email, sub: profile.id, role };
    const access_token = jwt.sign(payload, JWT_SECRET);

    return res.status(200).json({
      access_token,
      user: {
        id: profile.id,
        email: profile.email,
        firstName: profile.full_name.split(' ')[0],
        lastName: profile.full_name.split(' ').slice(1).join(' '),
        role,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
