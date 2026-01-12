import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationController } from './organization/organization.controller';
import { DepartmentModule } from './department/department.module';
import { OrganizationModule } from './organization/organization.module';
import { CollegeModule } from './college/college.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    DepartmentModule,
    OrganizationModule,  
    CollegeModule,
  ],
})
export class AppModule {}
