import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Organization - College
  const collegeOrg = await prisma.organization.create({
    data: {
      name: 'Pallotti College',
      type: 'COLLEGE',
    },
  });

  // College
  const college = await prisma.college.create({
    data: {
      orgId: collegeOrg.id,
      collegeName: 'St. Vincent Pallotti College of Engineering',
      collegeType: 'ENGINEERING',
      address: 'Nagpur',
      contactPerson: 'Admin',
      contactEmail: 'admin@pallotti.edu',
      mobile: '9999999999',
      maxStudents: 500,
      isApproved: true,
    },
  });

  // Department
  const department = await prisma.department.create({
    data: {
      name: 'Computer Science',
      collegeId: college.id,
    },
  });

  // Sample User (Student)
  const user = await prisma.user.upsert({
  where: { email: 'student1@test.com' },
  update: {},
  create: {
    email: 'student1@test.com',
    password: 'hashed-password-placeholder',
    role: 'STUDENT',
    orgId: collegeOrg.id,
  },
});


  // Student Profile
  const student = await prisma.student.create({
    data: {
      rollNo: 'CS001',
      year: 2,
      userId: user.id,
      collegeId: college.id,
      departmentId: department.id,
    },
  });

  console.log('Seed completed successfully');
  console.log({ collegeOrg, college, department, user, student });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());