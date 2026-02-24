import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { DepartmentModule } from './modules/department/department.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { CollegesModule } from './modules/college/college.module';
import { StudentsModule } from './modules/students/students.module';
import { TestsModule } from './modules/tests/tests.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { CompanyModule } from './modules/company/company.module';
import { CompanyTestsModule } from './modules/company-tests/company-tests.module';
import { DrivesModule } from './modules/drives/drives.module';
import { AdminModule } from './modules/admin/admin.module';
<<<<<<< HEAD
import { InstructorModule } from './modules/instructor/instructor.module';
import { HealthModule } from './health/health.module';
=======
import { SectionsModule } from './modules/sections/sections.module';
import { PracticeSetsModule } from './modules/practice-sets/practice-sets.module';


>>>>>>> d91389d827f612a3fc5abc416ed8d834194b8ae9

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
    CompanyTestsModule,
    DrivesModule,
    AdminModule,
<<<<<<< HEAD
    InstructorModule,
    HealthModule,
=======
    SectionsModule,
    PracticeSetsModule,
>>>>>>> d91389d827f612a3fc5abc416ed8d834194b8ae9
  ],
})
export class AppModule { }
