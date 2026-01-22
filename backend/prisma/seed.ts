import { PrismaClient, UserRole, CollegeType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  /**
   * ⚠️ DELETE ORDER (CHILD → PARENT)
   */
  await prisma.submissionAnswer.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.question.deleteMany();
  await prisma.testSection.deleteMany();
  await prisma.test.deleteMany();
  await prisma.student.deleteMany();
  await prisma.department.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  console.log('🧹 Database cleaned');

  /**
   * 🏢 Organization
   */
  const org = await prisma.organization.create({
    data: {
      name: 'Demo Education Org',
      type: 'COLLEGE',
    },
  });

  /**
   * 🏫 College
   */
  const college = await prisma.college.create({
    data: {
      orgId: org.id,
      collegeName: 'Demo Engineering College',
      collegeType: CollegeType.ENGINEERING,
      address: 'Nagpur',
      contactPerson: 'Principal',
      contactEmail: 'principal@demo.edu',
      mobile: '9999999999',
      maxStudents: 500,
      isApproved: true,
    },
  });

  /**
   * 🏢 Departments
   */
  const cse = await prisma.department.create({
    data: {
      name: 'Computer Science',
      collegeId: college.id,
    },
  });

  const it = await prisma.department.create({
    data: {
      name: 'Information Technology',
      collegeId: college.id,
    },
  });

  /**
   * 👤 Admin User
   */
  const admin = await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      password: '$2b$10$abcdefghijklmnopqrstuv', // dummy hash
      role: UserRole.SUPER_ADMIN,
      orgId: org.id,
    },
  });

  /**
   * 🎓 Students
   */
  const studentUser1 = await prisma.user.create({
    data: {
      email: 'student1@demo.com',
      password: '$2b$10$abcdefghijklmnopqrstuv',
      role: UserRole.STUDENT,
      orgId: org.id,
    },
  });

  const studentUser2 = await prisma.user.create({
    data: {
      email: 'student2@demo.com',
      password: '$2b$10$abcdefghijklmnopqrstuv',
      role: UserRole.STUDENT,
      orgId: org.id,
    },
  });

  await prisma.student.create({
    data: {
      rollNo: 'CSE101',
      year: 2,
      userId: studentUser1.id,
      collegeId: college.id,
      departmentId: cse.id,
    },
  });

  await prisma.student.create({
    data: {
      rollNo: 'IT201',
      year: 3,
      userId: studentUser2.id,
      collegeId: college.id,
      departmentId: it.id,
    },
  });

  console.log('✅ Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });