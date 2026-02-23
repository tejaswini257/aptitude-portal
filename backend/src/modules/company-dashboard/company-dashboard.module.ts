import { Module } from '@nestjs/common';
import { CompanyDashboardController } from './company-dashboard.controller';
import { CompanyDashboardService } from './company-dashboard.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [CompanyDashboardController],
  providers: [CompanyDashboardService, PrismaService],
})
export class CompanyDashboardModule {}
