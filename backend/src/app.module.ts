import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RentRequestsModule } from './rent-requests/rent-requests.module';
import { WalletsModule } from './wallets/wallets.module';

@Module({
  imports: [PrismaModule, AuthModule, RentRequestsModule, WalletsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
