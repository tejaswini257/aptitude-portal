/*import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { OrgType, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE COMPANY + COMPANY ADMIN
  async create(dto: CreateCompanyDto) {
    const hashedPassword = await bcrypt.hash(dto.adminPassword, 10);

    const company = await this.prisma.organization.create({
      data: {
        name: dto.name,
        type: OrgType.COMPANY,
      },
    });

    await this.prisma.user.create({
      data: {
        email: dto.adminEmail,
        password: hashedPassword,
        role: UserRole.COMPANY_ADMIN,
        orgId: company.id,
      },
    });

    return {
      message: 'Company created successfully',
      companyId: company.id,
    };
  }

  // GET ALL COMPANIES
  async findAll() {
    return this.prisma.organization.findMany({
      where: { type: OrgType.COMPANY },
      include: {
        users: true,
      },
    });
  }

  // COMPANY DASHBOARD
  async getDashboard(user: any) {
    const orgId = user.orgId;

    if (!orgId) {
      throw new NotFoundException('Organization not found');
    }

    const totalTests = await this.prisma.test.count({
      where: { orgId: orgId },
    });

    const activeTests = await this.prisma.test.count({
      where: {
        orgId: orgId,
        status: 'PUBLISHED',
      },
    });

    const testIds = tests.map(t => t.id);

    const totalCandidates = await this.prisma.submission.count({
      where: {
        test: {
          orgId: orgId,
        },
      },
    });

    return {
      totalTests,
      totalDrives,
      totalCandidates,
    };
  }
}*/

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { OrgType, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE COMPANY + COMPANY ADMIN
  async create(dto: CreateCompanyDto) {
    const hashedPassword = await bcrypt.hash(dto.adminPassword, 10);

    const company = await this.prisma.organization.create({
      data: {
        name: dto.name,
        type: OrgType.COMPANY,
      },
    });

    await this.prisma.user.create({
      data: {
        email: dto.adminEmail,
        password: hashedPassword,
        role: UserRole.COMPANY_ADMIN,
        orgId: company.id,
      },
    });

    return {
      message: 'Company created successfully',
      companyId: company.id,
    };
  }

  // GET ALL COMPANIES
  async findAll() {
    return this.prisma.organization.findMany({
      where: { type: OrgType.COMPANY },
      include: {
        users: true,
      },
    });
  }

  // COMPANY DASHBOARD
  async getDashboard(user: any) {
    const orgId = user.orgId;

    if (!orgId) {
      throw new NotFoundException('Organization not found');
    }

    // TOTAL TESTS
    const totalTests = await this.prisma.test.count({
      where: { orgId },
    });

    // ACTIVE TESTS
    // Using isPublished instead of non-existent status
    const activeTests = await this.prisma.test.count({
      where: {
        orgId,
        isPublished: true,
      },
    });

    // FETCH TEST IDS (fixes "tests is not defined")
    const tests = await this.prisma.test.findMany({
      where: { orgId },
      select: { id: true },
    });

    const testIds = tests.map(t => t.id);

    // TOTAL DRIVES (fixes "totalDrives not defined")
    const totalDrives = await this.prisma.drive.count({
      where: {
        companyId: orgId,
      },
    });

    // TOTAL CANDIDATES
    const totalCandidates = await this.prisma.submission.count({
      where: {
        testId: {
          in: testIds,
        },
      },
    });

    return {
      totalTests,
      activeTests,
      totalDrives,
      totalCandidates,
    };
  }
}

