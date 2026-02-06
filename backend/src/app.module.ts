import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { DepartmentModule } from './modules/department/department.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { CollegesModule } from './modules/college/college.module';
import { StudentsModule } from './modules/students/students.module';
import { TestsModule } from './modules/tests/tests.module';
import { CompanyModule } from './modules/company/company.module';

// 👇 ADD THIS
import { OrganizationController } from './modules/organization/organization.controller';
import { QuestionsModule } from './modules/questions/questions.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { CompaniesModule } from './modules/companies/companies.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    DepartmentModule,
    OrganizationModule,
    CollegesModule,
    StudentsModule,
    TestsModule,
    QuestionsModule,
    SubmissionsModule,
    CompanyModule,
  ],
})
export class AppModule {}