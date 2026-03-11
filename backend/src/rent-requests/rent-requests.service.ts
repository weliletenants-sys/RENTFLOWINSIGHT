import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RentRequestsService {
  constructor(private prisma: PrismaService) {}

  async createRequest(userId: string, data: { propertyId: string; amount: number; months: number }) {
    // 1. Validate property
    const property = await this.prisma.property.findUnique({
      where: { id: data.propertyId }
    });
    if (!property) throw new NotFoundException('Property not found');

    // 2. Create the Rent Request
    return this.prisma.rentRequest.create({
      data: {
        amountRequired: data.amount,
        status: 'PENDING',
        tenant: { connect: { id: userId } },
        property: { connect: { id: data.propertyId } }
      }
    });
  }

  async getMyRequests(userId: string) {
    return this.prisma.rentRequest.findMany({
      where: { tenantId: userId },
      include: {
        property: { include: { landlord: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getAllRequests() {
    return this.prisma.rentRequest.findMany({
      include: {
        tenant: { select: { firstName: true, lastName: true, email: true } },
        property: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'FUNDED') {
    return this.prisma.rentRequest.update({
      where: { id },
      data: { status }
    });
  }
}
