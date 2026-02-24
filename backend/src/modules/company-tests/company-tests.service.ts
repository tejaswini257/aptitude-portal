import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { QuestionType, DifficultyLevel, QuestionUsage, CreatorRole } from '@prisma/client';

import { CreateCompanyTestDto } from './dto/create-test.dto';
@Injectable()
export class CompanyTestsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateCompanyTestDto, orgId: string) {
    const marksPerQuestion = dto.marksPerQuestion ?? 1;
    const negativeMarking = dto.negativeMarking ?? false;
    const negativeMarks = negativeMarking ? (dto.negativeMarks ?? 0) : null;
    const durationMinutes = dto.durationMinutes ?? 30;

    let rulesId = dto.rulesId;
    if (!rulesId) {
      const rules = await this.prisma.rules.create({
        data: {
          id: randomUUID(),
          totalMarks: 0,
          marksPerQuestion,
          negativeMarking,
          negativeMarks,
        },
      });
      rulesId = rules.id;
    }

    const test = await this.prisma.test.create({
      data: {
        name: dto.name,
        orgId,
        rulesId,
        showResultImmediately: dto.showResultImmediately ?? false,
        proctoringEnabled: dto.proctoringEnabled ?? false,
      },
    });

    const section = await this.prisma.section.create({
      data: {
        id: randomUUID(),
        orgId,
        sectionName: 'General',
        isActive: true,
      },
    });

    await this.prisma.testSection.create({
      data: {
        id: randomUUID(),
        testId: test.id,
        sectionId: section.id,
        timeLimit: durationMinutes,
      },
    });

    if (dto.questions && dto.questions.length > 0) {
      for (const q of dto.questions) {
        const questionId = randomUUID();
        await this.prisma.question.create({
          data: {
            id: questionId,
            sectionId: section.id,
            orgId: orgId,
            difficulty: q.difficulty,
            questionText: q.title,
            allowedFor: QuestionUsage.TEST,
            createdBy: orgId,
            creatorRole: CreatorRole.COMPANY,
            type: q.type,
            correctAnswer: q.correctAnswer,
            isActive: true,
            options: {
              create: q.options.map((opt, idx) => ({
                id: randomUUID(),
                optionCode: `${String.fromCharCode(65 + idx)}`,
                optionText: opt,
                isCorrect: opt === q.correctAnswer
              }))
            }
          }
        });
      }
    }

    return this.findOne(test.id, orgId);
  }

  async findAll(orgId: string) {
    return this.prisma.test.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
      include: {
        rules: true,
        sections: {
          include: { section: { select: { id: true, sectionName: true } } },
        },
      } as any,
    });
  }

  async findOne(id: string, orgId: string) {
    const test = await this.prisma.test.findUnique({
      where: { id },
      include: {
        rules: true,
        sections: {
          include: { section: { select: { id: true, sectionName: true } } },
        },
      } as any,
    });

    if (!test) throw new NotFoundException('Test not found');
    if (test.orgId !== orgId) throw new ForbiddenException('Access denied');
    return test;
  }

  async update(id: string, dto: Partial<CreateCompanyTestDto>, orgId: string) {
    const test = await this.prisma.test.findUnique({ where: { id } });
    if (!test) throw new NotFoundException('Test not found');
    if (test.orgId !== orgId) throw new ForbiddenException('Access denied');

    const testData: Record<string, unknown> = {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.showResultImmediately !== undefined
        ? { showResultImmediately: dto.showResultImmediately }
        : {}),
      ...(dto.proctoringEnabled !== undefined ? { proctoringEnabled: dto.proctoringEnabled } : {}),
    };

    if (Object.keys(testData).length > 0) {
      await this.prisma.test.update({
        where: { id },
        data: testData as any,
      });
    }

    const rulesData: Record<string, unknown> = {
      ...(dto.marksPerQuestion !== undefined ? { marksPerQuestion: dto.marksPerQuestion } : {}),
      ...(dto.negativeMarking !== undefined ? { negativeMarking: dto.negativeMarking } : {}),
      ...(dto.negativeMarks !== undefined ? { negativeMarks: dto.negativeMarks } : {}),
    };

    if (Object.keys(rulesData).length > 0) {
      await this.prisma.rules.update({
        where: { id: test.rulesId },
        data: rulesData as any,
      });
    }

    if (dto.durationMinutes !== undefined) {
      const section = await this.prisma.testSection.findFirst({
        where: { testId: id },
      });
      if (section) {
        await this.prisma.testSection.update({
          where: { id: section.id },
          data: { timeLimit: dto.durationMinutes },
        });
      }
    }

    return this.findOne(id, orgId);
  }

  async archive(id: string, orgId: string) {
    const test = await this.prisma.test.findUnique({ where: { id } });
    if (!test) throw new NotFoundException('Test not found');
    if (test.orgId !== orgId) throw new ForbiddenException('Access denied');

    return this.prisma.test.update({
      where: { id },
      data: {
        showResultImmediately: false,
        proctoringEnabled: false,
      },
    });
  }
}
