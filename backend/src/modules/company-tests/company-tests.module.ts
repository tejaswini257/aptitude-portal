import { Module } from '@nestjs/common';
import { CompanyTestsController } from './company-tests.controller';
import { CompanyTestsService } from './company-tests.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { SubsciptionGuard } from '../../common/guards/subsciption.guard';

@Module({
  imports: [PrismaModule],
  controllers: [CompanyTestsController],
  providers: [CompanyTestsService, SubsciptionGuard],
})
export class CompanyTestsModule {}
