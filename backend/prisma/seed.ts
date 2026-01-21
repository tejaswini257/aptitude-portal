import { PrismaClient, UserRole, OrgType, CollegeType } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {

  // ORGANIZATION
  const organization = await prisma.organization.create({
    data: {
      name: "Pallotti College",
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
      maxStudents: 500,
      isApproved: true,
    },

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
      email: 'admin@pallotti.edu',
      password: adminPassword,
      role: UserRole.SUPER_ADMIN,
    },
  })

  // STUDENT USER
  const studentPassword = await bcrypt.hash('Student@123', 10)

  const studentUser = await prisma.user.create({
    data: {
      email: 'student1@test.com',
      password: studentPassword,
      role: UserRole.STUDENT,
      orgId: organization.id,
    },
  })

<<<<<<< HEAD
<<<<<<< HEAD
  console.log('✅ Seed completed successfully');
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
