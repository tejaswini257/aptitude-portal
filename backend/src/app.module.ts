import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
<<<<<<< HEAD
import { AuthModule } from './auth/auth.module';
import { DepartmentModule } from './department/department.module';
import { OrganizationModule } from './organization/organization.module';
import { CollegesModule } from './modules/college/college.module';
=======
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationController } from './modules/organization/organization.controller';
import { DepartmentModule } from './modules/department/department.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { CollegeModule } from './modules/college/college.module';
>>>>>>> ccc50dd65c65df8ff30d736b8382cf9ed7bb1034

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    DepartmentModule,
    OrganizationModule,
    CollegesModule,
  ],
})
export class AppModule {}
