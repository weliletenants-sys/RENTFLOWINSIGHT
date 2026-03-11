import { Module } from '@nestjs/common';
import { RentRequestsService } from './rent-requests.service';
import { RentRequestsController } from './rent-requests.controller';

@Module({
  providers: [RentRequestsService],
  controllers: [RentRequestsController]
})
export class RentRequestsModule {}
