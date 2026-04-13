import prisma from '../../prisma/prisma.client';
import { Prisma } from '@prisma/client';

export class AuthRepository {
  /**
   * Retrieves a User strictly by their unique Phone Number.
   * This forms the backbone of the native credential validation.
   */
  async findProfileByPhone(phone: string) {
    return prisma.profiles.findUnique({
      where: { phone }
    });
  }

  /**
   * Retrieves a User by their internal Platform ID.
   */
  async findProfileById(id: string) {
    return prisma.profiles.findUnique({
      where: { id }
    });
  }

  /**
   * Provisions a brand new profile for Native signups.
   */
  async createProfile(data: {
    phone: string;
    full_name: string;
    password_hash: string;
    role: string;
  }) {
    const now = new Date().toISOString();
    return prisma.profiles.create({
      data: {
        phone: data.phone,
        full_name: data.full_name,
        password_hash: data.password_hash,
        role: data.role,
        is_frozen: false,
        verified: false,
        created_at: now,
        updated_at: now,
      }
    });
  }
}
