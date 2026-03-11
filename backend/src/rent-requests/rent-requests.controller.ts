import { Controller, Post, Get, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { RentRequestsService } from './rent-requests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('rent-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RentRequestsController {
  constructor(private readonly rentRequestsService: RentRequestsService) {}

  @Post()
  @Roles(Role.TENANT)
  async createRequest(@Request() req: any, @Body() body: { propertyId: string; amount: number; months: number }) {
    return this.rentRequestsService.createRequest(req.user.userId, body);
  }

  @Get('me')
  @Roles(Role.TENANT)
  async getMyRequests(@Request() req: any) {
    return this.rentRequestsService.getMyRequests(req.user.userId);
  }

  @Get()
  @Roles(Role.AGENT, Role.SUPPORTER)
  async getAllRequests() {
    return this.rentRequestsService.getAllRequests();
  }

  @Patch(':id/status')
  @Roles(Role.AGENT)
  async updateStatus(@Param('id') id: string, @Body() body: { status: 'APPROVED' | 'REJECTED' | 'FUNDED' }) {
    return this.rentRequestsService.updateStatus(id, body.status);
  }
}
