import { PrismaClient, UserRole, OrgType, CollegeType } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {

  // 1️⃣ ORGANIZATION
  const organization = await prisma.organization.create({
    data: {
      name: 'Pallotti College',
      type: OrgType.COLLEGE,
    },
  })

// 2️⃣ COLLEGE (FINAL CORRECT VERSION)
const college = await prisma.college.create({
  data: {
    // ✅ REQUIRED SCALAR
    orgId: organization.id,

    // ✅ REQUIRED RELATION
    organization: {
      connect: {
        id: organization.id,
      },
    },

    collegeName: 'St. Vincent Pallotti College of Engineering',
    collegeType: CollegeType.ENGINEERING,
    address: 'Nagpur, Maharashtra',
    contactPerson: 'Dr. John Doe',
    contactEmail: 'contact@pallotti.edu',
    mobile: '9876543210',
    maxStudents: 500,
    isApproved: true,
  },
})




  // 3️⃣ DEPARTMENT
  const department = await prisma.department.create({
    data: {
      name: 'Computer Science',
      collegeId: college.id,
    },
  })

  // 4️⃣ SUPER ADMIN USER
  const adminPassword = await bcrypt.hash('Admin@123', 10)

  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@pallotti.edu',
      password: adminPassword,
      role: UserRole.SUPER_ADMIN,
      orgId: organization.id,
    },
  })

  // 5️⃣ STUDENT USER
  const studentPassword = await bcrypt.hash('Student@123', 10)

  const studentUser = await prisma.user.create({
    data: {
      email: 'student1@test.com',
      password: studentPassword,
      role: UserRole.STUDENT,
      orgId: organization.id,
    },
  })

  console.log('✅ Seed completed successfully')
  console.log({
    organization,
    college,
    department,
    superAdmin,
    studentUser,
  })
}

main()
  .catch((err) => {
    console.error('❌ Seed failed', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
