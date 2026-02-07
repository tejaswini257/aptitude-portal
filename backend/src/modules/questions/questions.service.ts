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
    });
  }

  // ✅ GET QUESTIONS BY SECTION
  async findBySection(sectionId: string) {
    return this.prisma.question.findMany({
      where: {
        sectionId,
      },
      include: {
        options: true,
      },
    });
  }

  // ✅ GET SINGLE QUESTION
  async findOne(id: string) {
    return this.prisma.question.findUnique({
      where: { id },
      include: {
        options: true,
      },
    });
  }
}
