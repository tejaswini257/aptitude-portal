import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
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
