import prisma from '../../prisma/prisma.client';

export class UsersRepository {

  async getUserProfileSafe(userId: string) {
    return prisma.profiles.findUnique({
      where: { id: userId },
      select: {
        id: true,
        full_name: true,
        phone: true,
        role: true,
        created_at: true,
        is_frozen: true
      }
    });
  }

  async updateProfile(userId: string, data: { full_name?: string }) {
    return prisma.profiles.update({
      where: { id: userId },
      data: {
        full_name: data.full_name,
        updated_at: new Date().toISOString()
      },
      select: {
        id: true,
        full_name: true,
        phone: true
      }
    });
  }
}
