import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UserRole } from '@prisma/client';
import { OrgType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  /** List all organizations with type COMPANY */
  async findAll() {
    return this.prisma.organization.findMany({
      where: { type: OrgType.COMPANY },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Get one company by id */
  async findOne(id: string) {
    const org = await this.prisma.organization.findFirst({
      where: { id, type: OrgType.COMPANY },
    });
    if (!org) {
      throw new NotFoundException('Company not found');
    }
    return org;
  }

  /** Create company (Organization type COMPANY + COMPANY_ADMIN user) */
  async create(dto: CreateCompanyDto) {
    const existingOrg = await this.prisma.organization.findFirst({
      where: { name: dto.name },
    });
    if (existingOrg) {
      throw new BadRequestException('Company with this name already exists');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.adminEmail },
    });
    if (existingUser) {
      throw new BadRequestException('Admin email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.adminPassword, 10);

    const org = await this.prisma.organization.create({
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
        orgId: org.id,
      },
    });

    return org;
  }

  /** Delete company and its admin users (users linked to this org) */
  async remove(id: string) {
    const org = await this.prisma.organization.findFirst({
      where: { id, type: OrgType.COMPANY },
    });
    if (!org) {
      throw new NotFoundException('Company not found');
    }

    await this.prisma.$transaction([
      this.prisma.user.deleteMany({ where: { orgId: id } }),
      this.prisma.organization.delete({ where: { id } }),
    ]);

    return { message: 'Company deleted successfully' };
  }

  /** Dashboard stats for a company (by orgId). Returns zeros when orgId is missing (e.g. SUPER_ADMIN view). */
  /** Dashboard stats for COMPANY_ADMIN (single org) or SUPER_ADMIN (all orgs) */
async getDashboardStats(orgId?: string | null) {
  const testWhere = orgId
    ? { orgId }
    : {}; // SUPER_ADMIN → all orgs

  const [totalTests, totalCandidates] = await Promise.all([
    this.prisma.test.count({
      where: testWhere,
    }),
    this.prisma.submission.count({
      where: orgId
        ? {}
        : {}, // SUPER_ADMIN → all submissions
    }),
  ]);

  return {
    totalDrives: 0,
    activeDrives: 0,
    totalTests,
    totalCandidates,
  };
}


}
