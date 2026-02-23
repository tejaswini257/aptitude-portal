import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreatorRole,
  DifficultyLevel,
  QuestionType,
  QuestionUsage,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: unknown, orgId: string) {
    const payload = dto as {
      sectionId: string;
      type: QuestionType;
      difficulty: DifficultyLevel;
      questionText: string;
      allowedFor: QuestionUsage;
      createdBy: string;
      creatorRole: CreatorRole;
      correctAnswer?: string | null;
      codingMeta?: unknown;
      options?: Array<{
        optionCode: string;
        optionText: string;
        isCorrect: boolean;
      }>;
    };

    return this.prisma.question.create({
      data: {
        sectionId: payload.sectionId,
        orgId,
        type: payload.type,
        difficulty: payload.difficulty,
        questionText: payload.questionText,
        allowedFor: payload.allowedFor,
        createdBy: payload.createdBy,
        creatorRole: payload.creatorRole,
        correctAnswer: payload.correctAnswer ?? null,
        codingMeta: payload.codingMeta ?? null,
        options: {
          create: (payload.options || []).map((option) => ({
            optionCode: option.optionCode,
            optionText: option.optionText,
            isCorrect: option.isCorrect,
          })),
        },
      },
      include: { options: true },
    });
  }

  async findByTest(testId: string) {
    return this.prisma.question.findMany({
      where: {
        section: {
          testSections: {
            some: { testId },
          },
        },
      },
      include: { options: true },
    });
  }

  async getPracticeSections() {
    const grouped = await this.prisma.question.groupBy({
      by: ['sectionId'],
      where: {
        allowedFor: { in: [QuestionUsage.PRACTICE, QuestionUsage.BOTH] },
        isActive: true,
      },
      _count: { sectionId: true },
    });

    const sectionIds = grouped.map((item) => item.sectionId);
    if (sectionIds.length === 0) return [];

    const sections = await this.prisma.section.findMany({
      where: { id: { in: sectionIds } },
      select: { id: true, sectionName: true },
    });

    const countMap = new Map(
      grouped.map((item) => [item.sectionId, item._count.sectionId]),
    );
    return sections.map((section) => ({
      id: section.id,
      name: section.sectionName,
      questionCount: countMap.get(section.id) ?? 0,
    }));
  }

  async getPracticeQuestions(
    topic?: string,
    difficulty?: DifficultyLevel,
    limit = 20,
  ) {
    const normalizedLimit = Number.isFinite(limit)
      ? Math.max(1, Math.min(50, limit))
      : 20;

    return this.prisma.question.findMany({
      where: {
        allowedFor: { in: [QuestionUsage.PRACTICE, QuestionUsage.BOTH] },
        isActive: true,
        ...(difficulty ? { difficulty } : {}),
        ...(topic
          ? {
              section: {
                sectionName: {
                  contains: topic,
                  mode: 'insensitive',
                },
              },
            }
          : {}),
      },
      select: {
        id: true,
        questionText: true,
        difficulty: true,
        section: {
          select: {
            id: true,
            sectionName: true,
          },
        },
        options: {
          select: {
            id: true,
            optionText: true,
          },
          orderBy: { optionCode: 'asc' },
        },
        correctAnswer: true,
      },
      take: normalizedLimit,
      orderBy: { id: 'asc' },
    });
  }

  async update(id: string, dto: unknown) {
    const existing = await this.prisma.question.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Question not found');
    }

    const payload = dto as {
      sectionId?: string;
      type?: QuestionType;
      difficulty?: DifficultyLevel;
      questionText?: string;
      correctAnswer?: string | null;
    };

    return this.prisma.question.update({
      where: { id },
      data: {
        ...(payload.sectionId ? { sectionId: payload.sectionId } : {}),
        ...(payload.type ? { type: payload.type } : {}),
        ...(payload.difficulty ? { difficulty: payload.difficulty } : {}),
        ...(payload.questionText ? { questionText: payload.questionText } : {}),
        ...(payload.correctAnswer !== undefined
          ? {
              correctAnswer: payload.correctAnswer
                ? String(payload.correctAnswer)
                : null,
            }
          : {}),
      },
    });
  }

  async delete(id: string) {
    const existing = await this.prisma.question.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Question not found');
    }

    return this.prisma.question.delete({ where: { id } });
  }
}
