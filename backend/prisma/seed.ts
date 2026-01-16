import { PrismaClient, UserRole, OrgType, CollegeType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 🏢 Organization
  const organization = await prisma.organization.upsert({
    where: { name: 'Pallotti College' },
    update: {},
    create: {
      name: 'Pallotti College',
      type: OrgType.COLLEGE,
    },
  });

  // 🏫 College
  const college = await prisma.college.upsert({
    where: { orgId: organization.id },
    update: {},
    create: {
      orgId: organization.id,
      collegeName: 'St. Vincent Pallotti College of Engineering',
      collegeType: CollegeType.ENGINEERING,
      address: 'Nagpur',
      contactPerson: 'Admin',
      contactEmail: 'admin@pallotti.edu',
      mobile: '9999999999',
      maxStudents: 500,
      isApproved: true,
    },
  });

  // 🏬 Department
  const department = await prisma.department.upsert({
    where: {
      name_collegeId: {
        name: 'Computer Science',
        collegeId: college.id,
      },
    },
    update: {},
    create: {
      name: 'Computer Science',
      collegeId: college.id,
    },
  });

  // 🔑 SUPER ADMIN
  const adminPassword = await bcrypt.hash('Admin@123', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@pallotti.edu' },
    update: {},
    create: {
      email: 'admin@pallotti.edu',
      password: adminPassword,
      role: UserRole.SUPER_ADMIN,
      orgId: organization.id,
    },
  });

  // 🧑‍💼 COLLEGE ADMIN (IMPORTANT FOR TESTS)
  const collegeAdminPassword = await bcrypt.hash('College@123', 10);

  const collegeAdmin = await prisma.user.upsert({
    where: { email: 'collegeadmin@pallotti.edu' },
    update: {},
    create: {
      email: 'collegeadmin@pallotti.edu',
      password: collegeAdminPassword,
      role: UserRole.COLLEGE_ADMIN,
      orgId: organization.id,
    },
  });

  // 🎓 STUDENT USER
  const studentPassword = await bcrypt.hash('Student@123', 10);

  const studentUser = await prisma.user.upsert({
    where: { email: 'student1@test.com' },
    update: {},
    create: {
      email: 'student1@test.com',
      password: studentPassword,
      role: UserRole.STUDENT,
      orgId: organization.id,
    },
  });

  // 🎓 STUDENT PROFILE
  const student = await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      rollNo: 'CS001',
      year: 2,
      userId: studentUser.id,
      collegeId: college.id,
      departmentId: department.id,
    },
  });

  console.log('✅ Seed completed successfully');
  console.log({
    organization,
    college,
    department,
    superAdmin,
    collegeAdmin,
    studentUser,
    student,
  });
}

main()
  .catch((err) => {
    console.error('❌ Seed failed', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
