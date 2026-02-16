import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { randomUUID } from 'crypto';


@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  // Create test (schema: name, orgId, rulesId, showResultImmediately, proctoringEnabled)
  async create(dto: CreateTestDto, orgId: string) {
  return this.prisma.$transaction(async (tx) => {
    // 1️⃣ Create Rules
    const rules = await tx.rules.create({
      data: {
        totalMarks: dto.rules.totalMarks,
        marksPerQuestion: dto.rules.marksPerQuestion,
        negativeMarking: dto.rules.negativeMarking,
        negativeMarks: dto.rules.negativeMarking
          ? dto.rules.negativeMarks ?? 0
          : null,
      },
    });

    // 2️⃣ Create Test
    const test = await tx.test.create({
      data: {
        name: dto.name,
        showResultImmediately: dto.showResultImmediately ?? false,
        proctoringEnabled: dto.proctoringEnabled ?? false,
        orgId,
        rulesId: rules.id,
      },
    });

    // 3️⃣ Attach Sections
    for (const sec of dto.sections) {
      await tx.testSection.create({
        data: {
          testId: test.id,
          sectionId: sec.sectionId,
          timeLimit: sec.timeLimit,
        },
      });
    }

    return test;
  });
}



  // ✅ GET ALL (optionally with attempt count for college/company dashboard)
  async findAll(
    orgId: string | undefined | null,
    user?: any,
    withAttemptCount = false,
  ) {
    if (!orgId || orgId === '') return [];

    const baseWhere: any = { orgId };

    // 🔥 If student → restrict visibility to published & active only
    if (user?.role === 'STUDENT') {
      baseWhere.isPublished = true;
      baseWhere.isActive = true;
    }

    const tests = await this.prisma.test.findMany({
      where: baseWhere,
      orderBy: { createdAt: 'desc' },
    });

    if (!withAttemptCount) return tests;

    const counts = await this.prisma.submission.groupBy({
      by: ['testId'],
      _count: { testId: true },
      where: { testId: { in: tests.map((t) => t.id) } },
    });
    const countMap = Object.fromEntries(
      counts.map((c) => [c.testId, c._count.testId]),
    );

    return tests.map((t) => ({
      ...t,
      attemptCount: countMap[t.id] ?? 0,
    }));
  }

  // ✅ GET ONE (orgId optional — when undefined, find by id only for students)
  async findOne(id: string, orgId?: string | null) {
    const where: { id: string; orgId?: string } = { id };
    if (orgId != null && orgId !== '') where.orgId = orgId;

    const test = await this.prisma.test.findFirst({
      where,
      include: { rules: true, sections: true } as any,
    });

    if (!test) throw new NotFoundException('Test not found');

    return test;
  }

  // UPDATE (only schema fields)
  async update(id: string, dto: UpdateTestDto) {
    const data: Record<string, unknown> = {};
    if (dto.name != null) data.name = dto.name;
    if (dto.showResultImmediately != null)
      data.showResultImmediately = dto.showResultImmediately;
    if (dto.proctoringEnabled != null)
      data.proctoringEnabled = dto.proctoringEnabled;
    return this.prisma.test.update({
      where: { id },
      data: data as any,
    });
  }

  // ✅ DELETE
  async remove(id: string, orgId: string) {
    const test = await this.prisma.test.findFirst({
      where: { id, orgId },
    });

    if (!test) throw new NotFoundException('Test not found');

    return this.prisma.test.delete({
      where: { id },
    });
  }

  /** Get submissions for a test (college/company admin) - students who attempted + scores */
  async getSubmissionsForTest(testId: string, orgId: string) {
    const test = await this.prisma.test.findFirst({
      where: { id: testId, orgId },
    });
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

    return submissions.map((s) => ({
      id: s.id,
      studentId: s.studentId,
      studentEmail: s.student?.user?.email ?? '—',
      rollNo: s.student?.rollNo ?? '—',
      department: s.student?.department?.name ?? '—',
      score: s.score,
      submittedAt: s.submittedAt,
    }));
  }

  async getQuestionsForTest(testId: string) {
    const test = await this.prisma.test.findUnique({
      where: { id: testId },
      include: {
        sections: {
          include: {
            section: {
              include: {
                questions: {
                  include: { options: true },
                },
              },
            },
          },
        },
      },
    });

    if (!test) throw new NotFoundException('Test not found');
    if (!test.isPublished || !test.isActive) {
      throw new BadRequestException('Test not available');
    }

    // Return format: [{ sectionId, sectionName, questions: [...] }]
    return (test.sections as any[]).map((ts: any) => ({
      sectionId: ts.sectionId,
      sectionName: ts.section?.sectionName ?? 'Section',
      questions: (ts.section?.questions ?? []).map((q: any) => ({
        id: q.id,
        questionText: q.questionText,
        options: (q.options ?? []).map((opt: any) => ({
          id: opt.id,
          optionCode: opt.optionCode,
          optionText: opt.optionText,
        })),
      })),
    }));
  }

  async togglePublish(id: string, orgId?: string | null) {
    const where: { id: string; orgId?: string } = { id };
    if (orgId) where.orgId = orgId;

    const test = await this.prisma.test.findFirst({ where });
    if (!test) throw new NotFoundException('Test not found');

    return this.prisma.test.update({
    where: { id },
    data: {
      isPublished: !test.isPublished,
    },
  });
}

  async toggleActive(id: string, orgId?: string | null) {
    const where: { id: string; orgId?: string } = { id };
    if (orgId) where.orgId = orgId;

    const test = await this.prisma.test.findFirst({ where });
    if (!test) throw new NotFoundException('Test not found');

    // Safety rule: cannot activate if not published
  if (!test.isPublished && !test.isActive) {
    throw new BadRequestException("Publish test before activating");
  }

  return this.prisma.test.update({
    where: { id },
    data: {
      isActive: !test.isActive,
    },
  });
}
}
