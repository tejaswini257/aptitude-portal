import { PrismaClient, UserRole, OrgType, CollegeType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 🏢 Organization
  const organization = await prisma.organization.create({
    data: {
      name: 'Pallotti College',
      type: OrgType.COLLEGE,
    },
  });

  // 🏫 College
  const college = await prisma.college.create({
    data: {
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
  const department = await prisma.department.create({
    data: {
      name: 'Computer Science',
      collegeId: college.id,
    },
  });

  // 🔑 SUPER ADMIN
  const adminPassword = await bcrypt.hash('Admin@123', 10);

  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@pallotti.edu',
      password: adminPassword,
      role: UserRole.SUPER_ADMIN,
      orgId: organization.id,
    },
  });

  // 🎓 STUDENT USER
  const studentPassword = await bcrypt.hash('Student@123', 10);

  const studentUser = await prisma.user.create({
    data: {
      email: 'student1@test.com',
      password: studentPassword,
      role: UserRole.STUDENT,
      orgId: organization.id,
    },
  });

  // 🎓 STUDENT PROFILE
  const student = await prisma.student.create({
    data: {
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
