import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  // ✅ CREATE
  async create(dto: any, orgId: string) {
    return this.prisma.question.create({
      data: {
        sectionId: dto.sectionId,
        orgId,
        difficulty: dto.difficulty,
        questionText: dto.questionText,
        allowedFor: dto.allowedFor,
        createdBy: dto.createdBy,
        creatorRole: dto.creatorRole,
        type: dto.type,
        correctAnswer: dto.correctAnswer ?? null,
        codingMeta: dto.codingMeta ?? null,
        options: dto.options
          ? {
              create: dto.options.map((opt: any) => ({
                optionCode: opt.optionCode,
                optionText: opt.optionText,
                isCorrect: opt.isCorrect,
              })),
            }
          : undefined,
      },
      include: { options: true },
    });
  }

  // ✅ FIND BY TEST
  async findByTest(testId: string) {
    return this.prisma.question.findMany({
      where: {
        section: {
          testSections: {
            some: {
              testId,
            },
          },
        },
      },
      include: { options: true },
    });
  }

  // ✅ UPDATE
  async update(id: string, dto: any) {
    const existing = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!existing) throw new NotFoundException('Question not found');

    return this.prisma.question.update({
      where: { id },
      data: {
        questionText: dto.questionText,
        difficulty: dto.difficulty,
        correctAnswer: dto.correctAnswer,
      },
    });
  }

  // ✅ DELETE
  async delete(id: string) {
    const existing = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!existing) throw new NotFoundException('Question not found');

    return this.prisma.question.delete({
      where: { id },
    });
  }
}
