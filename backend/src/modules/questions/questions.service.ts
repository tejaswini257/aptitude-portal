import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  // =============================
  // CREATE QUESTION
  // =============================
  async create(dto: any, orgId: string) {
    return this.prisma.question.create({
      data: {
        sectionId: dto.sectionId,
        orgId,
        type: dto.type,
        difficulty: dto.difficulty,
        questionText: dto.questionText,
        allowedFor: dto.allowedFor,
        createdBy: dto.createdBy,
        creatorRole: dto.creatorRole,
        correctAnswer: dto.correctAnswer ?? null,
        codingMeta: dto.codingMeta ?? null,

        Option: {
  create: dto.options.map((opt: any) => ({
    optionCode: opt.optionCode,
    optionText: opt.optionText,
    isCorrect: opt.isCorrect,
  })),
},

      },
      include: { Option: true },
    });
  }

  // =============================
  // GET QUESTIONS BY TEST
  // =============================
  async findByTest(testId: string) {
    return this.prisma.question.findMany({
      where: {
        section: {
          TestSection: {
            some: { testId },
          },
        },
      },
      include: { Option: true },
    });
  }

  // =============================
  // UPDATE QUESTION
  // =============================
  async update(id: string, dto: any) {
    const existing = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Question not found');
    }

    return this.prisma.question.update({
      where: { id },
      data: {
        ...(dto.sectionId && { sectionId: dto.sectionId }),
        ...(dto.type && { type: dto.type }),
        ...(dto.difficulty && { difficulty: dto.difficulty }),
        ...(dto.questionText && { questionText: dto.questionText }),
        ...(dto.correctAnswer !== undefined && {
          correctAnswer:
            dto.correctAnswer !== null
              ? String(dto.correctAnswer)
              : null,
        }),
      },
    });
  }

  // =============================
  // DELETE QUESTION
  // =============================
  async delete(id: string) {
    const existing = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Question not found');
    }

    return this.prisma.question.delete({
      where: { id },
    });
  }
}
