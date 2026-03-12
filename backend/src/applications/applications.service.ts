import { Injectable, NotFoundException } from '@nestjs/common';
// PrismaClient has been regenerated to fix schema typing
import { PrismaService } from '../prisma/prisma.service';

interface StartApplicationDto {
  tenant_id: string;
  rent_amount: number;
}

interface SaveStep1Dto {
  occupation: string;
  workAddress: string;
  homeAddress: string;
  village: string;
  parish: string;
  subCounty: string;
  district: string;
  landlordName: string;
  landlordPhone: string;
  landlordAddress: string;
  houseNumber: string;
  rentAmount: number;
  rentPeriod: number;
  rentPerMonth: number;
}

interface SaveStep2Dto {
  paybackPeriodDays?: number;
  nextOfKinName: string;
  nextOfKinPhone: string;
  relationship: string;
}

interface SaveStep3Dto {
  documents: { document_type: string; file_url: string }[];
}

interface SaveStep4Dto {
  lc1_file_url: string;
  consented: boolean;
}

interface StartAgentKycDto {
  agent_id: string;
}

interface SaveAgentKycStep1Dto {
  occupation?: string;
  residence?: string;
  district?: string;
  city?: string;
}

interface SaveAgentKycStep2Dto {
  nextOfKin: {
    fullName: string;
    contactNumber: string;
    residence: string;
    relationship: string;
  }[];
}

interface SaveAgentKycStep3Dto {
  documents: { document_type: string; file_url: string }[];
  consented: boolean;
}

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async startApplication(data: StartApplicationDto) {
    // Basic logic to initialize an application for a user
    const application = await this.prisma.applications.create({
      data: {
        tenant_id: data.tenant_id,
        rent_amount: data.rent_amount,
        status: 'PENDING',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });
    return application;
  }

  async saveStep1(id: string, data: SaveStep1Dto) {
    // Save tenant profile info and landlord info
    const application = await this.prisma.applications.findUnique({
      where: { id },
    });
    if (!application) throw new NotFoundException('Application not found');

    await this.prisma.tenantProfiles.create({
      data: {
        profile_id: application.tenant_id,
        occupation: data.occupation,
        work_address: data.workAddress,
        home_address: data.homeAddress,
        village_cell: data.village,
        parish_ward: data.parish,
        sub_county: data.subCounty,
        district: data.district,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });

    await this.prisma.landlordDetails.create({
      data: {
        tenant_id: application.tenant_id,
        landlord_name: data.landlordName,
        landlord_phone: data.landlordPhone,
        landlord_address: data.landlordAddress,
        house_unit_number: data.houseNumber,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });

    return await this.prisma.applications.update({
      where: { id },
      data: {
        rent_amount: data.rentAmount,
        rent_period_months: data.rentPeriod,
        rent_per_month: data.rentPerMonth,
        updated_at: new Date().toISOString(),
      },
    });
  }

  async saveStep2(id: string, data: SaveStep2Dto) {
    const application = await this.prisma.applications.findUnique({
      where: { id },
    });
    if (!application) throw new NotFoundException('Application not found');

    let accessFee = 10000;
    if (application.rent_amount > 200000) {
      accessFee = 20000;
    }

    const totalRepayment = application.rent_amount + accessFee;
    const paybackPeriodDays = data.paybackPeriodDays || 30;
    const dailyRepayment = totalRepayment / paybackPeriodDays;

    await this.prisma.repaymentSchedules.create({
      data: {
        application_id: id,
        total_repayment: totalRepayment,
        payback_period_days: paybackPeriodDays,
        daily_repayment_amount: dailyRepayment,
        start_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });

    await this.prisma.landlordDetails.updateMany({
      where: { tenant_id: application.tenant_id },
      data: {
        next_of_kin_name: data.nextOfKinName,
        next_of_kin_phone: data.nextOfKinPhone,
        next_of_kin_relationship: data.relationship,
        updated_at: new Date().toISOString(),
      },
    });

    return await this.prisma.applications.update({
      where: { id },
      data: {
        access_fee: accessFee,
        total_repayment: totalRepayment,
        daily_repayment: dailyRepayment,
        payback_period_days: paybackPeriodDays,
        updated_at: new Date().toISOString(),
      },
    });
  }

  async saveStep3(id: string, data: SaveStep3Dto) {
    const documents = data.documents; // Array of { document_type, file_url }
    for (const doc of documents) {
      await this.prisma.identityDocuments.create({
        data: {
          application_id: id,
          document_type: doc.document_type,
          file_url: doc.file_url,
          uploaded_at: new Date().toISOString(),
        },
      });
    }
    return { success: true };
  }

  async saveStep4(id: string, data: SaveStep4Dto) {
    // LC1 upload
    await this.prisma.lc1Documents.create({
      data: {
        application_id: id,
        file_url: data.lc1_file_url,
        consented: data.consented,
        uploaded_at: new Date().toISOString(),
      },
    });

    return await this.prisma.applications.update({
      where: { id },
      data: {
        status: 'PENDING', // finalize submission
        updated_at: new Date().toISOString(),
      },
    });
  }

  async getApplication(id: string) {
    return this.prisma.applications.findUnique({ where: { id } });
  }

  // --- AGENT KYC METHODS ---

  async startAgentKyc(data: StartAgentKycDto) {
    const application = await this.prisma.agentApplications.create({
      data: {
        agent_id: data.agent_id,
        status: 'PENDING',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });

    await this.prisma.agentProfiles.create({
      data: {
        agent_id: data.agent_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });

    return application;
  }

  async saveAgentKycStep1(id: string, data: SaveAgentKycStep1Dto) {
    const application = await this.prisma.agentApplications.findUnique({ where: { id } });
    if (!application) throw new NotFoundException('Agent Application not found');

    return await this.prisma.agentProfiles.update({
      where: { agent_id: application.agent_id },
      data: {
        occupation: data.occupation,
        residence: data.residence,
        district: data.district,
        city: data.city,
        updated_at: new Date().toISOString(),
      },
    });
  }

  async saveAgentKycStep2(id: string, data: SaveAgentKycStep2Dto) {
    const application = await this.prisma.agentApplications.findUnique({ where: { id } });
    if (!application) throw new NotFoundException('Agent Application not found');

    for (const nok of data.nextOfKin) {
      await this.prisma.agentNextOfKin.create({
        data: {
          agent_id: application.agent_id,
          full_name: nok.fullName,
          contact_number: nok.contactNumber,
          residence: nok.residence,
          relationship: nok.relationship,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });
    }

    return { success: true };
  }

  async saveAgentKycStep3(id: string, data: SaveAgentKycStep3Dto) {
    const application = await this.prisma.agentApplications.findUnique({ where: { id } });
    if (!application) throw new NotFoundException('Agent Application not found');

    for (const doc of data.documents) {
      await this.prisma.identityDocuments.create({
        data: {
          application_id: id,
          document_type: doc.document_type,
          file_url: doc.file_url,
          uploaded_at: new Date().toISOString(),
        },
      });
    }

    return await this.prisma.agentApplications.update({
      where: { id },
      data: {
        status: 'PENDING', // Submit for review
        updated_at: new Date().toISOString(),
      },
    });
  }

  async getAgentApplication(id: string) {
    return this.prisma.agentApplications.findUnique({ where: { id } });
  }
}
