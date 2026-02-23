import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CompanyDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(user: any) {
    const orgId = user?.orgId;

    if (!orgId) {
      throw new NotFoundException('Organization not found');
    }

    // Total Tests created by this company
    const totalTests = await this.prisma.test.count({
      where: { orgId },
    });

    // Total Drives created by this company
    const totalDrives = await this.prisma.drive.count({
      where: { companyId: orgId },
    });

    // Get all test IDs of this company
    const tests = await this.prisma.test.findMany({
      where: { orgId },
      select: { id: true },
    });

    const testIds = tests.map((t) => t.id);

    // Total submissions for those tests
    const totalCandidates = await this.prisma.submission.count({
      where: {
        testId: {
          in: testIds.length ? testIds : ['dummy'],
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
