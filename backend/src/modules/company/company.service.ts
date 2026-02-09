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

    const totalTests = await this.prisma.test.count({
      where: { orgId },
    });

    const totalDrives = await this.prisma.drive.count({
      where: { companyId: orgId },
    });

    const tests = await this.prisma.test.findMany({
      where: { orgId },
      select: { id: true },
    });

    const testIds = tests.map(t => t.id);

    const totalCandidates = await this.prisma.submission.count({
      where: {
        testId: { in: testIds },
      },
    });

    return {
      totalTests,
      totalDrives,
      totalCandidates,
    };
  }
}
