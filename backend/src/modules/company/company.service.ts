import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { OrgType, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ CREATE COMPANY + COMPANY ADMIN
  async create(dto: CreateCompanyDto) {
    const hashedPassword = await bcrypt.hash(dto.adminPassword, 10);

    // 1️⃣ Create Company Organization
    const company = await this.prisma.organization.create({
      data: {
        name: dto.name,
        type: OrgType.COMPANY,
      },
    });

    // 2️⃣ Create Company Admin User
    await this.prisma.user.create({
      data: {
        email: dto.adminEmail,
        password: hashedPassword,
        role: UserRole.COMPANY_ADMIN,
        orgId: company.id,
      },
<<<<<<< HEAD
    });

    return {
      message: 'Company created successfully',
      companyId: company.id,
=======
    });

    return {
      message: 'Company created successfully',
      companyId: company.id,
    };
  }

  // ✅ COMPANY DASHBOARD (FOR COMPANY ADMIN)
  async dashboard(user: any) {
    const orgId = user.orgId;

    if (!orgId) {
      throw new NotFoundException('Organization not found');
    }

    const totalTests = await this.prisma.test.count({
      where: { organizationId: orgId },
    });

    const activeTests = await this.prisma.test.count({
      where: {
        organizationId: orgId,
        status: 'PUBLISHED',
      },
    });

    const totalCandidates = await this.prisma.submission.count({
      where: {
        test: {
          organizationId: orgId,
        },
      },
    });

    return {
      totalTests,
      activeTests,
      totalCandidates,
>>>>>>> cb51ccf3a1369e3b0530bab8797a5aa8db0cfdbb
    };
  }

  // // ✅ COMPANY DASHBOARD (FOR COMPANY ADMIN)
  // async dashboard(user: any) {
  //   const orgId = user.orgId;

  //   if (!orgId) {
  //     throw new NotFoundException('Organization not found');
  //   }

   async getDashboard(user: any) {
  const orgId = user.orgId;

  if (!orgId) {
    throw new NotFoundException('Organization not found');
  }

  // Total tests created by this company
  const totalTests = await this.prisma.test.count({
    where: { orgId },
  });

  // Total drives created by this company
  const totalDrives = await this.prisma.drive.count({
    where: { companyId: orgId },
  });

  // Get all tests IDs of this company
  const tests = await this.prisma.test.findMany({
    where: { orgId },
    select: { id: true },
  });

  const testIds = tests.map(t => t.id);

  // Count submissions for those tests
  const totalCandidates = await this.prisma.submission.count({
    where: {
      testId: {
        in: testIds,
      },
    },
  });

  return {
    totalTests,
    totalDrives,
    totalCandidates,
  };
}
}