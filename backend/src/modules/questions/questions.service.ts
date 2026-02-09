import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateQuestionDto, orgId?: string, createdBy?: string) {
    const sectionId = dto.sectionId;
    if (!sectionId) {
      throw new Error('sectionId is required');
    }
    return this.prisma.question.create({
      data: {
        sectionId,
        orgId: orgId ?? '',
        difficulty: dto.difficulty,
        questionText: dto.title ?? dto.description ?? '',
        allowedFor: 'BOTH',
        createdBy: createdBy ?? 'system',
        creatorRole: 'ADMIN',
        type: dto.type,
        correctAnswer: dto.correctAnswer != null ? String(dto.correctAnswer) : null,
        codingMeta: dto.evaluationConfig ?? null,
        isActive: true,
      },
    });
  }

  async findByTest(testId: string) {
    const testSections = await this.prisma.testSection.findMany({
      where: { testId },
      select: { sectionId: true },
    });
    const sectionIds = testSections.map((ts) => ts.sectionId);
    if (sectionIds.length === 0) return [];
    return this.prisma.question.findMany({
      where: { sectionId: { in: sectionIds } },
      orderBy: { id: 'asc' },
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

    const data: Record<string, unknown> = {};
    if (dto.sectionId) data.sectionId = dto.sectionId;
    if (dto.type) data.type = dto.type;
    if (dto.difficulty) data.difficulty = dto.difficulty;
    if (dto.title) data.questionText = dto.title;
    if (dto.description !== undefined) data.questionText = dto.description ?? exists.questionText;
    if (dto.correctAnswer !== undefined) data.correctAnswer = dto.correctAnswer != null ? String(dto.correctAnswer) : null;

    return this.prisma.question.update({
      where: { id },
      data: data as any,
    });
  }

  delete(id: string) {
    return this.prisma.question.delete({
      where: { id },
    });
  }
}
