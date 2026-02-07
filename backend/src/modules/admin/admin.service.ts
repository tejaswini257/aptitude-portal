import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrgType } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  /** Dashboard stats for super admin: counts of colleges, companies, students */
  async getDashboardStats() {
    const [colleges, companies, students] = await Promise.all([
      this.prisma.college.count(),
      this.prisma.organization.count({ where: { type: OrgType.COMPANY } }),
      this.prisma.student.count(),
    ]);

    return {
      colleges,
      companies,
      students,
    };
  }
}
