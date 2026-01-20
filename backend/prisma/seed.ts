import { PrismaClient, UserRole, OrgType, CollegeType } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
<<<<<<< HEAD
  console.log('🌱 Seeding database...');

  // 🏢 Organization
  const organization = await prisma.organization.upsert({
    where: { name: 'Pallotti College' },
    update: {},
    create: {
      name: 'Pallotti College',
=======

  // ORGANIZATION
  const organization = await prisma.organization.create({
    data: {
      name: "Pallotti College",
>>>>>>> 5231ac343f14862984660c9ee374256fe9ee8a30
      type: OrgType.COLLEGE,
    },
  })

<<<<<<< HEAD
  // 🏫 College
  const college = await prisma.college.upsert({
    where: { orgId: organization.id },
    update: {},
    create: {
=======
  // COLLEGE
  const college = await prisma.college.create({
    data: {
>>>>>>> 5231ac343f14862984660c9ee374256fe9ee8a30
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
  })

<<<<<<< HEAD
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
=======
  // DEPARTMENT
  const department = await prisma.department.create({
    data: {
>>>>>>> 5231ac343f14862984660c9ee374256fe9ee8a30
      name: 'Computer Science',
      collegeId: college.id,
    },
  })

<<<<<<< HEAD
  // 🔑 SUPER ADMIN
  const adminPassword = await bcrypt.hash('Admin@123', 10);
=======
  // SUPER ADMIN USER
  const adminPassword = await bcrypt.hash('Admin@123', 10)
>>>>>>> 5231ac343f14862984660c9ee374256fe9ee8a30

  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@pallotti.edu',
      password: adminPassword,
      role: UserRole.SUPER_ADMIN,
      orgId: organization.id,
    },
  })

<<<<<<< HEAD
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
=======
  // STUDENT USER
  const studentPassword = await bcrypt.hash('Student@123', 10)
>>>>>>> 5231ac343f14862984660c9ee374256fe9ee8a30

  const studentUser = await prisma.user.create({
    data: {
      email: 'student1@test.com',
      password: studentPassword,
      role: UserRole.STUDENT,
      orgId: organization.id,
    },
  })

<<<<<<< HEAD
  // 🎓 STUDENT PROFILE
  const student = await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
=======
  // STUDENT PROFILE
  const student = await prisma.student.create({
    data: {
>>>>>>> 5231ac343f14862984660c9ee374256fe9ee8a30
      rollNo: 'CS001',
      year: 2,
      userId: studentUser.id,
      collegeId: college.id,
      departmentId: department.id,
    },
  })

<<<<<<< HEAD
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
=======
  console.log('✅ Seed completed successfully')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
>>>>>>> 5231ac343f14862984660c9ee374256fe9ee8a30
