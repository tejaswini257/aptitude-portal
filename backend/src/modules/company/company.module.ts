import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { CompanyDashboardModule } from '../company-dashboard/company-dashboard.module';


@Module({
  imports: [PrismaModule, CompanyDashboardModule],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
