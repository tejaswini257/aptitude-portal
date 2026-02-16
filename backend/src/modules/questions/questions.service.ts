import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreatorRole } from '@prisma/client';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // CREATE QUESTION
  // ============================================
  async create(dto: CreateQuestionDto, user: any) {
    // 🔹 Map application role → DB enum
    let mappedRole: CreatorRole;

    if (
      user.role === 'COLLEGE_ADMIN' ||
      user.role === 'SUPER_ADMIN'
    ) {
      mappedRole = CreatorRole.ADMIN;
    } else if (user.role === 'COMPANY_ADMIN') {
      mappedRole = CreatorRole.COMPANY;
    } else {
      throw new Error('Invalid role for question creation');
    }

    // 🔹 Get next order automatically
    const lastQuestion = await this.prisma.question.findFirst({
      where: { sectionId: dto.sectionId },
      orderBy: { order: 'desc' },
    });

    const nextOrder = lastQuestion ? lastQuestion.order + 1 : 1;

    return this.prisma.question.create({
      data: {
        sectionId: dto.sectionId,
        orgId: user.orgId,
        type: dto.type,
        difficulty: dto.difficulty,
        questionText: dto.questionText,
        correctAnswer: dto.correctAnswer ?? null,
        allowedFor: dto.allowedFor,
        createdBy: user.userId ?? user.id, // depends on JWT payload
        creatorRole: mappedRole,
        marks: dto.marks,
        order: nextOrder,
        options: {
          create: (dto.options ?? []).map((opt) => ({
            optionCode: opt.optionCode,
            optionText: opt.optionText,
            isCorrect: opt.isCorrect,
          })),
        },
      },
      include: { options: true },
    });
  }

  // ============================================
  // GET QUESTIONS BY TEST
  // ============================================
  async findByTest(testId: string, orgId: string) {
    return this.prisma.question.findMany({
      where: {
        section: {
          testSections: {
            some: {
              testId,
              test: {
                orgId,
              },
            },
          },
        },
      },
      orderBy: { order: 'asc' },
      include: {
        options: true,
      },
    });
  }

  // ============================================
  // UPDATE QUESTION
  // ============================================
  async update(id: string, dto: Partial<CreateQuestionDto>) {
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
          correctAnswer: dto.correctAnswer ?? null,
        }),
      },
    });
  }

  // ============================================
  // DELETE QUESTION
  // ============================================
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

  // ============================================
  // REORDER QUESTION
  // ============================================
  async reorder(questionId: string, direction: 'UP' | 'DOWN') {
    const current = await this.prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!current) {
      throw new NotFoundException('Question not found');
    }

    const swapWith = await this.prisma.question.findFirst({
      where: {
        sectionId: current.sectionId,
        order:
          direction === 'UP'
            ? { lt: current.order }
            : { gt: current.order },
      },
      orderBy: {
        order: direction === 'UP' ? 'desc' : 'asc',
      },
    });

    if (!swapWith) return;

    await this.prisma.$transaction([
      this.prisma.question.update({
        where: { id: current.id },
        data: { order: swapWith.order },
      }),
      this.prisma.question.update({
        where: { id: swapWith.id },
        data: { order: current.order },
      }),
    ]);
  }
}