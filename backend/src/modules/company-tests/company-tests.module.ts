import { Module } from '@nestjs/common';
import { CompanyTestsController } from './company-tests.controller';
import { CompanyTestsService } from './company-tests.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CompanyTestsController],
  providers: [CompanyTestsService],
})
export class CompanyTestsModule {}
