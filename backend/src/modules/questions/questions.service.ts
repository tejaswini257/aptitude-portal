/*import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateQuestionDto } from './dto/create-question.dto';


@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: {
  testId: dto.testId,
  sectionId: dto.sectionId ?? undefined,
  type: dto.type,
  difficulty: dto.difficulty,
  title: dto.title,
  description: dto.description,
  correctAnswer: dto.correctAnswer ?? null,
  evaluationConfig: dto.evaluationConfig ?? null,
  marks: dto.marks,
  timeLimitSec: dto.timeLimitSec ?? null,
  order: dto.order,
  explanation: dto.explanation ?? null,
},


    });
  }

  findByTest(testId: string) {
    return this.prisma.question.findMany({
  where: { testId },
  orderBy: { createdAt: 'asc' },
});

  }

  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return question;
  }

  async update(id: string, dto: UpdateQuestionDto) {
    const exists = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Question not found');
    }

    return this.prisma.question.update({
      where: { id },
      data: {
        ...(dto.testId && { testId: dto.testId }),

        // ✅ same pattern as create()
        ...(dto.sectionId && { sectionId: dto.sectionId }),

        ...(dto.type && { type: dto.type }),
        ...(dto.difficulty && { difficulty: dto.difficulty }),
        ...(dto.title && { title: dto.title }),

        ...(dto.description !== undefined && {
          description: dto.description ?? null,
        }),

        ...(dto.options !== undefined && {
          options: dto.options as any,
        }),

        ...(dto.correctAnswer !== undefined && {
          correctAnswer: dto.correctAnswer as any,
        }),

        ...(dto.evaluationConfig !== undefined && {
          evaluationConfig: dto.evaluationConfig as any,
        }),

        ...(dto.marks !== undefined && { marks: dto.marks }),
        ...(dto.timeLimitSec !== undefined && {
          timeLimitSec: dto.timeLimitSec ?? null,
        }),

        ...(dto.order !== undefined && { order: dto.order }),

        ...(dto.explanation !== undefined && {
          explanation: dto.explanation ?? null,
        }),
      },
    });
  }

  delete(id: string) {
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
}*/


import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  // -----------------------------
  // CREATE QUESTION
  // -----------------------------
  create(dto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: {
        sectionId: dto.sectionId!,
        orgId: dto.orgId,
        questionText: dto.questionText,
        difficulty: dto.difficulty,
        type: dto.type,
        allowedFor: dto.allowedFor,
        createdBy: dto.createdBy,
        creatorRole: dto.creatorRole,
        correctAnswer: dto.correctAnswer ?? null,
        codingMeta: dto.codingMeta ?? null,
      },
    });
  }

  // -----------------------------
  // GET QUESTIONS BY SECTION
  // -----------------------------
  findBySection(sectionId: string) {
    return this.prisma.question.findMany({
      where: { sectionId },
      orderBy: { order: 'asc' }, // ✅ use order, not createdAt
    });
  }

  // -----------------------------
  // GET SINGLE QUESTION
  // -----------------------------
  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return question;
  }

  // -----------------------------
  // UPDATE QUESTION
  // -----------------------------
  async update(id: string, dto: UpdateQuestionDto) {
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
        ...(dto.questionText && { questionText: dto.questionText }),
        ...(dto.difficulty && { difficulty: dto.difficulty }),
        ...(dto.type && { type: dto.type }),
        ...(dto.allowedFor && { allowedFor: dto.allowedFor }),

        ...(dto.correctAnswer !== undefined && {
          correctAnswer: dto.correctAnswer ?? null,
        }),

        ...(dto.codingMeta !== undefined && {
          codingMeta: dto.codingMeta ?? null,
        }),

        ...(dto.isActive !== undefined && {
          isActive: dto.isActive,
        }),
      },
    });
  }

  // -----------------------------
  // DELETE QUESTION
  // -----------------------------
  delete(id: string) {
    return this.prisma.question.delete({
      where: { id },
    });
  }

  // -----------------------------
  // REORDER QUESTION ✅ ADDED
  // -----------------------------
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
