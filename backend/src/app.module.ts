import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RentRequestsModule } from './rent-requests/rent-requests.module';
import { WalletsModule } from './wallets/wallets.module';
import { ApplicationsModule } from './applications/applications.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
    RentRequestsModule, 
    WalletsModule,
    ApplicationsModule,
    UploadModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
