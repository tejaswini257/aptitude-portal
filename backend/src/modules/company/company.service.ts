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
      where: { orgId: orgId },
    });

    const activeTests = await this.prisma.test.count({
      where: {
        orgId: orgId,
        
      },
    });

    const totalCandidates = await this.prisma.submission.count({
      where: {
        
      },
    });

    return {
      totalTests,
      activeTests,
      totalCandidates,
    };
  }
}
