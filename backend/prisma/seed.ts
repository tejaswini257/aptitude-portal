import { PrismaClient, UserRole, OrgType, CollegeType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // -----------------------------
  // CLEANUP (optional for dev)
  // -----------------------------
await prisma.submissionAnswer.deleteMany();
await prisma.submission.deleteMany();
await prisma.question.deleteMany();       // ✅ NEW
await prisma.testSection.deleteMany();    // ✅ NEW
await prisma.test.deleteMany();
await prisma.student.deleteMany();
await prisma.department.deleteMany();
await prisma.college.deleteMany();
await prisma.user.deleteMany();
await prisma.organization.deleteMany();

  // -----------------------------
  // ORGANIZATION
  // -----------------------------
  const organization = await prisma.organization.create({
    data: {
      name: 'Demo College Organization',
      type: OrgType.COLLEGE,
    },
  });

  console.log('✅ Organization created:', organization.id);

  // -----------------------------
  // ADMIN USER
  // -----------------------------
  const adminPassword = await bcrypt.hash('Admin@123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      password: adminPassword,
      role: UserRole.SUPER_ADMIN,
      orgId: organization.id,
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // -----------------------------
  // COLLEGE
  // -----------------------------
  const college = await prisma.college.create({
    data: {
      orgId: organization.id,
      collegeName: 'Demo Engineering College',
      collegeType: CollegeType.ENGINEERING,
      address: 'Nagpur, Maharashtra',
      contactPerson: 'Principal Demo',
      contactEmail: 'principal@demo.com',
      mobile: '9999999999',
      maxStudents: 500,
      isApproved: true,
    },
  });

  console.log('✅ College created:', college.collegeName);

  // -----------------------------
  // DEPARTMENTS
  // -----------------------------
  const cseDept = await prisma.department.create({
    data: {
      name: 'Computer Science',
      collegeId: college.id,
    },
  });

  const mechDept = await prisma.department.create({
    data: {
      name: 'Mechanical',
      collegeId: college.id,
    },
  });

  console.log('✅ Departments created');

  // -----------------------------
  // STUDENT USERS
  // -----------------------------
  const studentPassword = await bcrypt.hash('Student@123', 10);

  const studentUser1 = await prisma.user.create({
    data: {
      email: 'student1@demo.com',
      password: studentPassword,
      role: UserRole.STUDENT,
      orgId: organization.id,
    },
  });

  const studentUser2 = await prisma.user.create({
    data: {
      email: 'student2@demo.com',
      password: studentPassword,
      role: UserRole.STUDENT,
      orgId: organization.id,
    },
  });

  console.log('✅ Student users created');

  // -----------------------------
  // STUDENT PROFILES
  // -----------------------------
  await prisma.student.create({
    data: {
      rollNo: 'CSE101',
      year: 2,
      userId: studentUser1.id,
      collegeId: college.id,
      departmentId: cseDept.id,
    },
  });

  await prisma.student.create({
    data: {
      rollNo: 'MECH201',
      year: 3,
      userId: studentUser2.id,
      collegeId: college.id,
      departmentId: mechDept.id,
    },
  });

  console.log('✅ Student profiles created');

  console.log('🌱 Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
