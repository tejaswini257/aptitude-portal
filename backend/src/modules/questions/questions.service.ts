import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DifficultyLevel, QuestionUsage, CreatorRole, QuestionType } from '@prisma/client';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  // ✅ CREATE QUESTION
  async create(dto: any, orgId: string) {
    return this.prisma.question.create({
      data: {
<<<<<<< HEAD
        sectionId: dto.sectionId,
        orgId: orgId,
        difficulty: dto.difficulty as DifficultyLevel,
        questionText: dto.questionText,
        allowedFor: dto.allowedFor as QuestionUsage,
        createdBy: dto.createdBy,
        creatorRole: dto.creatorRole as CreatorRole,
        type: dto.type as QuestionType,
        correctAnswer: dto.correctAnswer ?? null,
        codingMeta: dto.codingMeta ?? null,
      },
=======
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


>>>>>>> cb51ccf3a1369e3b0530bab8797a5aa8db0cfdbb
    });
  }

  // ✅ GET QUESTIONS BY SECTION
  async findBySection(sectionId: string) {
    return this.prisma.question.findMany({
<<<<<<< HEAD
      where: {
        sectionId,
      },
      include: {
        options: true,
      },
    });
=======
  where: { testId },
  orderBy: { createdAt: 'asc' },
});

>>>>>>> cb51ccf3a1369e3b0530bab8797a5aa8db0cfdbb
  }

  // ✅ GET SINGLE QUESTION
  async findOne(id: string) {
<<<<<<< HEAD
    return this.prisma.question.findUnique({
=======
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

    if (!exists) {
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
>>>>>>> cb51ccf3a1369e3b0530bab8797a5aa8db0cfdbb
      where: { id },
      include: {
        options: true,
      },
    });
  }
}
