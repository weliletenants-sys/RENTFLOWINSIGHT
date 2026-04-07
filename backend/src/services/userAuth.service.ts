import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/prisma.client';
import { logSecurityEvent } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export class UserAuthService {
  static async login(phone: string, passwordRaw: string, ip: string, userAgent: string) {
    const profile = await prisma.profiles.findFirst({ 
       where: phone.includes('@') ? { email: phone } : { phone: phone.trim() } 
    });

    if (!profile || !profile.password_hash) {
      try { await bcrypt.compare(passwordRaw, '$2b$12$LQv3c1tyKcgcgfpUX6m4wOEvB/P/4qE3F.qB0bZ3m6vE0bZ3m6vE0'); } catch (e) {}
      await logSecurityEvent({ event: 'USER_LOGIN_FAILED', actor_type: 'user', ip_address: ip, user_agent: userAgent, details: { reason: 'user_not_found_or_no_password', phone } });
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(passwordRaw, profile.password_hash);
    if (!isPasswordValid) {
      await logSecurityEvent({ event: 'USER_LOGIN_FAILED', actor_type: 'user', actor_id: profile.id, ip_address: ip, user_agent: userAgent, details: { reason: 'wrong_password', phone } });
      throw new Error('Invalid credentials');
    }

    const userRoleRecord = await prisma.userRoles.findFirst({ where: { user_id: profile.id, enabled: true }, orderBy: { created_at: 'desc' } }) || await prisma.userRoles.findFirst({ where: { user_id: profile.id }, orderBy: { created_at: 'desc' } });
    const role = userRoleRecord ? userRoleRecord.role.toUpperCase() : (profile.role ? profile.role.toUpperCase() : 'TENANT');
    
    // Explicit protection: If they are an Admin, DENY access from User domain!
    if (role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'CEO') {
         await logSecurityEvent({ event: 'USER_LOGIN_DENIED_WRONG_DOMAIN', actor_type: 'user', actor_id: profile.id, ip_address: ip, user_agent: userAgent, details: { requested_role: role } });
         throw new Error('Administrator accounts must log in through the secure admin portal.');
    }

    const payload = { phone: profile.phone, email: profile.email, sub: profile.id, role, firstName: profile.full_name.split(' ')[0] };
    const access_token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    await prisma.sessions.updateMany({
        where: { user_id: profile.id, is_revoked: false },
        data: { is_revoked: true } // Invalidate older sessions
    });

    await prisma.sessions.create({
      data: {
        user_id: profile.id,
        token: access_token,
        device_info: userAgent?.substring(0, 255) || null,
        ip_address: ip?.substring(0, 45) || null,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });

    await logSecurityEvent({ event: 'USER_LOGIN_SUCCESS', actor_type: 'user', actor_id: profile.id, ip_address: ip, user_agent: userAgent, action: 'login', status: 'success' });

    let onboarding_url = '/dashboard';
    if (role === 'AGENT' && profile.verified === false) onboarding_url = '/agent-onboarding';
    else if (role === 'AGENT') onboarding_url = '/dashboard';
    if (role === 'TENANT') onboarding_url = '/tenant-agreement';
    if (role === 'FUNDER') onboarding_url = '/funder';

    return {
      token: access_token,
      onboarding_url,
      user: {
        id: profile.id,
        email: profile.email,
        firstName: profile.full_name.split(' ')[0],
        lastName: profile.full_name.split(' ').slice(1).join(' '),
        role,
        isVerified: profile.verified,
        avatar_url: profile.avatar_url,
        phone: profile.phone
      }
    };
  }
}
