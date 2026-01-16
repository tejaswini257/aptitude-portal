// 

import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { DepartmentModule } from './modules/department/department.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { CollegesModule } from './modules/college/college.module';
import { StudentsModule } from './modules/students/students.module';

// 👇 ADD THIS
import { OrganizationController } from './modules/organization/organization.controller';
import { TestsModule } from './modules/tests/tests.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    DepartmentModule,
    OrganizationModule,
    CollegesModule,
    StudentsModule,
    TestsModule,
  ],
  // 👇 TEMPORARY TEST
  controllers: [OrganizationController],
})
export class AppModule {}