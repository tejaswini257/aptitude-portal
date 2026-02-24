import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Visibility } from '@prisma/client';

@Injectable()
export class PracticeSetsService {
  constructor(private prisma: PrismaService) {}

  async create(
    orgId: string,
    dto: {
      name: string;
      sectionId: string;
      sectionTimer: number;
      visibility?: Visibility;
    },
  ) {
    const section = await this.prisma.section.findFirst({
      where: { id: dto.sectionId, orgId },
      include: { questions: { select: { id: true } } },
    });
    if (!section) throw new NotFoundException('Section not found');

    const rules = await this.prisma.rules.create({
      data: {
        totalMarks: section.questions.length,
        marksPerQuestion: 1,
        negativeMarking: false,
        negativeMarks: null,
      },
    });

    const questionIds = section.questions.map((q) => q.id);

    return this.prisma.practiceSet.create({
      data: {
        name: dto.name,
        orgId,
        sectionTimer: dto.sectionTimer ?? 30,
        rulesId: rules.id,
        visibility: dto.visibility ?? Visibility.PRIVATE,
        questionIds: questionIds as any,
      },
    });
  }

  async findAll(orgId: string) {
    return this.prisma.practiceSet.findMany({
      where: { orgId },
      orderBy: { id: 'desc' },
    });
  }

  async findForStudent(orgId: string) {
    return this.prisma.practiceSet.findMany({
      where: {
        orgId,
        visibility: Visibility.PUBLIC,
      },
      include: { rules: true },
    });
  }

  async getQuestions(practiceSetId: string, orgId?: string) {
    const where: any = { id: practiceSetId };
    if (orgId) where.orgId = orgId;
    const ps = await this.prisma.practiceSet.findFirst({
      where,
      include: { rules: true },
    });
    if (!ps) throw new NotFoundException('Practice set not found');

    const ids = (ps.questionIds as string[]) ?? [];
    if (ids.length === 0) return { practiceSet: ps, questions: [] };

    const questions = await this.prisma.question.findMany({
      where: { id: { in: ids } },
      include: { options: true },
      orderBy: { order: 'asc' },
    });

    return {
      practiceSet: ps,
      questions: questions.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        options: q.options.map((o) => ({
          id: o.id,
          optionCode: o.optionCode,
          optionText: o.optionText,
        })),
      })),
    };
  }
}
