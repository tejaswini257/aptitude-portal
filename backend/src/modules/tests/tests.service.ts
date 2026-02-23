import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Injectable()
export class TestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTestDto, orgId: string) {
    if (!orgId) {
      throw new BadRequestException(
        'orgId is required to create a test. Log in as a College Admin or Company Admin.',
      );
    }

    const marksPerQuestion = dto.marksPerQuestion ?? 1;
    const negativeMarking = dto.negativeMarking ?? false;
    const negativeMarks = negativeMarking ? (dto.negativeMarks ?? 0) : null;
    const durationMinutes = dto.durationMinutes ?? 30;

    const rules = await this.prisma.rules.create({
      data: {
        id: randomUUID(),
        totalMarks: 0,
        marksPerQuestion,
        negativeMarking,
        negativeMarks,
      },
    });

    const test = await this.prisma.test.create({
      data: {
        name: dto.name,
        orgId,
        rulesId: rules.id,
        showResultImmediately: dto.showResultImmediately ?? false,
        proctoringEnabled: dto.proctoringEnabled ?? false,
      },
    });

    const section = await this.prisma.section.create({
      data: {
        id: randomUUID(),
        sectionName: 'General',
        orgId,
        isActive: true,
      },
    });

    await this.prisma.testSection.create({
      data: {
        id: randomUUID(),
        testId: test.id,
        sectionId: section.id,
        timeLimit: durationMinutes,
      },
    });

    return this.findOne(test.id, orgId);
  }

  async findAll(orgId: string, withAttemptCount = false) {
    const tests = await this.prisma.test.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
      include: {
        rules: true,
        sections: {
          include: { section: { select: { id: true, sectionName: true } } },
        },
      } as any,
    });

    if (!withAttemptCount) return tests;

    const counts = await this.prisma.submission.groupBy({
      by: ['testId'],
      _count: { testId: true },
      where: { testId: { in: tests.map((test) => test.id) } },
    });
    const countMap = Object.fromEntries(
      counts.map((count) => [count.testId, count._count.testId]),
    );

    return tests.map((test) => ({
      ...test,
      attemptCount: countMap[test.id] ?? 0,
    }));
  }

  async findOne(id: string, orgId: string) {
    const test = await this.prisma.test.findFirst({
      where: { id, orgId },
      include: {
        rules: true,
        sections: {
          include: { section: { select: { id: true, sectionName: true } } },
        },
      } as any,
    });

    if (!test) throw new NotFoundException('Test not found');
    return test;
  }

  async update(id: string, dto: UpdateTestDto) {
    const existing = await this.prisma.test.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Test not found');

    const testUpdate: Record<string, unknown> = {};
    if (dto.name != null) testUpdate.name = dto.name;
    if (dto.showResultImmediately != null) {
      testUpdate.showResultImmediately = dto.showResultImmediately;
    }
    if (dto.proctoringEnabled != null) {
      testUpdate.proctoringEnabled = dto.proctoringEnabled;
    }

    if (Object.keys(testUpdate).length > 0) {
      await this.prisma.test.update({
        where: { id },
        data: testUpdate as any,
      });
    }

    const rulesUpdate: Record<string, unknown> = {};
    if (dto.marksPerQuestion != null) rulesUpdate.marksPerQuestion = dto.marksPerQuestion;
    if (dto.negativeMarking != null) rulesUpdate.negativeMarking = dto.negativeMarking;
    if (dto.negativeMarks != null || dto.negativeMarking === false) {
      rulesUpdate.negativeMarks = dto.negativeMarking === false ? null : dto.negativeMarks;
    }

    if (Object.keys(rulesUpdate).length > 0) {
      await this.prisma.rules.update({
        where: { id: existing.rulesId },
        data: rulesUpdate as any,
      });
    }

    if (dto.durationMinutes != null) {
      const sectionLink = await this.prisma.testSection.findFirst({
        where: { testId: id },
      });

      if (sectionLink) {
        await this.prisma.testSection.update({
          where: { id: sectionLink.id },
          data: { timeLimit: dto.durationMinutes },
        });
      }
    }

    return this.findOne(id, existing.orgId);
  }

  async remove(id: string, orgId: string) {
    const test = await this.prisma.test.findFirst({ where: { id, orgId } });
    if (!test) throw new NotFoundException('Test not found');
    return this.prisma.test.delete({ where: { id } });
  }

  async getSubmissionsForTest(testId: string, orgId: string) {
    const test = await this.prisma.test.findFirst({ where: { id: testId, orgId } });
    if (!test) throw new NotFoundException('Test not found');

    const submissions = await this.prisma.submission.findMany({
      where: { testId },
      include: {
        student: {
          include: {
            user: { select: { email: true } },
            department: { select: { name: true } },
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });

    return submissions.map((submission) => ({
      id: submission.id,
      studentId: submission.studentId,
      studentEmail: submission.student?.user?.email ?? '--',
      rollNo: submission.student?.rollNo ?? '--',
      department: submission.student?.department?.name ?? '--',
      score: submission.score,
      submittedAt: submission.submittedAt,
    }));
  }

  async getQuestionsForTest(testId: string) {
    const testSections = await this.prisma.testSection.findMany({
      where: { testId },
      include: {
        section: {
          include: { questions: { include: { options: true } } },
        },
      } as any,
    });

    return testSections.map((testSection: any) => ({
      sectionId: testSection.sectionId,
      sectionName: testSection.section?.sectionName || 'Section',
      questions: testSection.section?.questions || [],
    }));
  }
}
