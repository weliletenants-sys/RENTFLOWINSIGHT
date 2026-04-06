import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/prisma.client';
import { logSecurityEvent } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export class AdminAuthService {
  static async login(phone: string, passwordRaw: string, ip: string, userAgent: string) {
    const profile = await prisma.profiles.findFirst({ 
       where: phone.includes('@') ? { email: phone } : { phone: phone.trim() } 
    });

    if (!profile || !profile.password_hash) {
      // Delay to avoid timing leaks
      try { await bcrypt.compare(passwordRaw, '$2b$12$LQv3c1tyKcgcgfpUX6m4wOEvB/P/4qE3F.qB0bZ3m6vE0bZ3m6vE0'); } catch (e) {}
      await logSecurityEvent({ event: 'ADMIN_LOGIN_FAILED', actor_type: 'admin', ip_address: ip, user_agent: userAgent, details: { reason: 'user_not_found_or_no_password', phone } });
      throw new Error('Invalid credentials');
    }

    // Explicit Context Verification
    const activeRoles = await prisma.userRoles.findMany({ where: { user_id: profile.id, enabled: true } });
    const rolesArray = activeRoles.map(r => r.role.toUpperCase());
    
    // Explicit condition: You MUST be an executive to use the Admin Auth Service
    if (!rolesArray.includes('ADMIN') && !rolesArray.includes('SUPER_ADMIN') && !rolesArray.includes('MANAGER') && !rolesArray.includes('CEO') && !rolesArray.includes('COO') && !rolesArray.includes('CFO') && !rolesArray.includes('CRM')) {
        await logSecurityEvent({ event: 'ADMIN_LOGIN_REJECTED', actor_type: 'admin', ip_address: ip, user_agent: userAgent, details: { reason: 'insufficient_domain_role', assigned_roles: rolesArray } });
        throw new Error('Unauthorized for admin domain');
    }

    const isPasswordValid = await bcrypt.compare(passwordRaw, profile.password_hash);
    if (!isPasswordValid) {
      await logSecurityEvent({ event: 'ADMIN_LOGIN_FAILED', actor_type: 'admin', actor_id: profile.id, ip_address: ip, user_agent: userAgent, details: { reason: 'wrong_password', phone } });
      throw new Error('Invalid credentials');
    }

    // Find primary executive role
    const primaryRole = activeRoles.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]?.role.toUpperCase() || 'MANAGER';
    
    // Invalidate old sessions to strictly enforce 1 active session natively if configured, else just add
    await prisma.sessions.updateMany({
        where: { user_id: profile.id, is_revoked: false },
        data: { is_revoked: true }
    });

    const payload = { phone: profile.phone, email: profile.email, sub: profile.id, role: primaryRole, firstName: profile.full_name.split(' ')[0] };
    const access_token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' }); // Shorter TTL for admin

    const createdSession = await prisma.sessions.create({
      data: {
        user_id: profile.id,
        token: access_token,
        device_info: userAgent?.substring(0, 255) || null,
        ip_address: ip?.substring(0, 45) || null,
        expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000)
      }
    });

    await logSecurityEvent({ event: 'ADMIN_LOGIN_SUCCESS', actor_type: 'admin', actor_id: profile.id, ip_address: ip, user_agent: userAgent, action: 'login', status: 'success' });

    let onboarding_url = '/admin';
    if (primaryRole === 'MANAGER') onboarding_url = '/admin/dashboard';
    if (primaryRole === 'CEO') onboarding_url = '/v1/executive';

    return {
      token: access_token,
      onboarding_url,
      user: {
        id: profile.id,
        email: profile.email,
        firstName: profile.full_name.split(' ')[0],
        lastName: profile.full_name.split(' ').slice(1).join(' '),
        role: primaryRole,
        isVerified: profile.verified,
        avatar_url: profile.avatar_url,
        phone: profile.phone
      }
    };
  }
}
