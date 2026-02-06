import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: {
  testId: dto.testId,
  ...(dto.sectionId && { sectionId: dto.sectionId }),

  type: dto.type,
  difficulty: dto.difficulty,

  // Prisma expects these JSON-ish fields first
  options: (dto.options as any) ?? null,
  correctAnswer: (dto.correctAnswer as any) ?? null,
  evaluationConfig: (dto.evaluationConfig as any) ?? null,

  marks: dto.marks,
  timeLimitSec: dto.timeLimitSec ?? null,
  order: dto.order,
  explanation: dto.explanation ?? null,

  // PUT THESE LAST (Prisma is picky about order in your current client)
  title: dto.title,
  description: dto.description ?? null,
},

    });
  }

  findByTest(testId: string) {
    return this.prisma.question.findMany({
      // ✅ FIX: use relation-based filter (works with your generated client)
      where: {
         testId
      },
      // ✅ FIX: safest ordering field that always exists
      orderBy: {
        order: 'asc',
      },
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
      where: { id },
    });
  }
}
