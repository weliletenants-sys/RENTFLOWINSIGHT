import { Controller, Post, Get, Body, Param, Put } from '@nestjs/common';
import { ApplicationsService } from './applications.service';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post('start')
  async startApplication(@Body() data: any) {
    return this.applicationsService.startApplication(data);
  }

  @Put(':id/step1')
  async saveStep1(@Param('id') id: string, @Body() data: any) {
    return this.applicationsService.saveStep1(id, data);
  }

  @Put(':id/step2')
  async saveStep2(@Param('id') id: string, @Body() data: any) {
    return this.applicationsService.saveStep2(id, data);
  }

  @Put(':id/step3')
  async saveStep3(@Param('id') id: string, @Body() data: any) {
    return this.applicationsService.saveStep3(id, data);
  }

  @Put(':id/step4')
  async saveStep4(@Param('id') id: string, @Body() data: any) {
    return this.applicationsService.saveStep4(id, data);
  }

  @Get(':id')
  async getApplication(@Param('id') id: string) {
    return this.applicationsService.getApplication(id);
  }

  // --- AGENT KYC ENDPOINTS ---

  @Post('agent/start')
  async startAgentKyc(@Body() data: any) {
    return this.applicationsService.startAgentKyc(data);
  }

  @Put('agent/:id/kyc-step1')
  async saveAgentKycStep1(@Param('id') id: string, @Body() data: any) {
    return this.applicationsService.saveAgentKycStep1(id, data);
  }

  @Put('agent/:id/kyc-step2')
  async saveAgentKycStep2(@Param('id') id: string, @Body() data: any) {
    return this.applicationsService.saveAgentKycStep2(id, data);
  }

  @Put('agent/:id/kyc-step3')
  async saveAgentKycStep3(@Param('id') id: string, @Body() data: any) {
    return this.applicationsService.saveAgentKycStep3(id, data);
  }

  @Get('agent/:id')
  async getAgentApplication(@Param('id') id: string) {
    return this.applicationsService.getAgentApplication(id);
  }
}
