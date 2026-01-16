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
        sectionId: dto.sectionId,
        type: dto.type,
        difficulty: dto.difficulty,
        title: dto.title,
        description: dto.description,
        options: dto.options,
        correctAnswer: dto.correctAnswer,
        evaluationConfig: dto.evaluationConfig,
        marks: dto.marks,
        timeLimitSec: dto.timeLimitSec,
        order: dto.order,
        explanation: dto.explanation,
      },
    });
  }

  findByTest(testId: string) {
    return this.prisma.question.findMany({
      where: { testId },
      orderBy: { order: 'asc' },
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
      data: dto,
    });
  }

  delete(id: string) {
    return this.prisma.question.delete({
      where: { id },
    });
  }
}
