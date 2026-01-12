import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DepartmentModule } from './department/department.module';
<<<<<<< HEAD
import { CollegesModule } from './modules/colleges/colleges.module';
import { OrganizationController } from './organization/organization.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    AuthModule,
    DepartmentModule,
    CollegesModule,   // ✅ IMPORTANT: THIS WAS MISSING
  ],
  controllers: [OrganizationController],
  providers: [AppService],
=======
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
>>>>>>> ee26383073cc635599d22b82d0e83989f6464583
})
export class AppModule {}
