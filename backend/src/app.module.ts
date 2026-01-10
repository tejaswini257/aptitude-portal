import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationController } from './organization/organization.controller';
import { DepartmentModule } from './department/department.module';

@Module({
  imports: [PrismaModule, AuthModule, DepartmentModule],
  controllers: [OrganizationController],
  providers: [AppService],
  
})
export class AppModule {}
