import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  applications: any;
  tenantProfiles: any;
  landlordDetails: any;
  identityDocuments: any;
  repaymentSchedules: any;
  lc1Documents: any;
  async onModuleInit() {
    await this.$connect();
  }
}
