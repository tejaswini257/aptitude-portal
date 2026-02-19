import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateQuestionDto } from './dto/create-question.dto';


@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  // CREATE QUESTION
  async create(dto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: {
        section: {
          connect: { id: dto.sectionId },
        },
        orgId: dto.orgId,
        difficulty: dto.difficulty,
        questionText: dto.questionText,
        allowedFor: dto.allowedFor,
        createdBy: dto.createdBy,
        creatorRole: dto.creatorRole,
        type: dto.type,
      },
    });
  }

  // ❌ Questions do NOT belong directly to Test
  // ✔ They belong to Section
  async findBySection(sectionId: string) {
    return this.prisma.question.findMany({
      where: { sectionId },
    });
  }

  // FIND ONE
  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return question;
  }

  // UPDATE QUESTION
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
        ...(dto.sectionId && {
          section: { connect: { id: dto.sectionId } },
        }),

        ...(dto.type && { type: dto.type }),
        ...(dto.difficulty && { difficulty: dto.difficulty }),
        ...(dto.questionText && { questionText: dto.questionText }),
        ...(dto.allowedFor && { allowedFor: dto.allowedFor }),
        ...(dto.correctAnswer !== undefined && {
          correctAnswer: dto.correctAnswer,
        }),
        ...(dto.codingMeta !== undefined && {
          codingMeta: dto.codingMeta,
        }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
  }

  // DELETE QUESTION
  async delete(id: string) {
    return this.prisma.question.delete({
      where: { id },
    });
  }
}
