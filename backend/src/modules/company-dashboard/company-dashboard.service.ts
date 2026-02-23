import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CompanyDashboardService {
  constructor(private readonly prisma: PrismaService) { }

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

    // Total submissions and score aggregations
    const submissions = await this.prisma.submission.findMany({
      where: {
        testId: {
          in: testIds.length ? testIds : ['dummy'],
        },
      },
      include: {
        student: {
          include: { user: true }
        },
        test: {
          select: { name: true }
        }
      },
      orderBy: { submittedAt: 'desc' },
    });

    const totalCandidates = submissions.length;
    let totalScore = 0;
    let passCount = 0;
    const passingThreshold = 60; // Assuming 60% is passing for now

    submissions.forEach(sub => {
      // Handle cases where sub.score might be out of 100 or something else. 
      // Assuming score is a percentage or absolute value. For now, doing simple math.
      const score = sub.score || 0;
      totalScore += score;
      if (score >= passingThreshold) {
        passCount++;
      }
    });

    const averageScore = totalCandidates > 0 ? Math.round(totalScore / totalCandidates) : 0;
    const failCount = totalCandidates - passCount;

    return {
      totalTests,
      totalDrives,
      totalCandidates,
      averageScore,
      passCount,
      failCount,
      recentSubmissions: submissions.slice(0, 5).map(sub => ({
        id: sub.id,
        studentName: sub.student.user.email, // Best effort without full profile
        testName: sub.test.name,
        score: sub.score,
        submittedAt: sub.submittedAt,
        status: (sub.score || 0) >= passingThreshold ? 'Passed' : 'Failed'
      })),
    };
  }
}
