import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestDto } from './dto/create-test.dto';

@Injectable()
export class TestService {
  constructor(private prisma: PrismaService) { }

  async createTest(dto: CreateTestDto, user: any) {
    const {
      name,
      showResultImmediately,
      proctoringEnabled,
      startTime,
      endTime,
      durationMode,
      totalDuration,
      resultPublishTime,
      rules,
      sections,
    } = dto;

    if (!sections || sections.length === 0) {
      throw new BadRequestException('At least one section is required');
    }

    const sectionIds = sections.map((s) => s.sectionId);
    const uniqueSectionIds = new Set(sectionIds);
    if (uniqueSectionIds.size !== sectionIds.length) {
      throw new BadRequestException('Duplicate sections are not allowed');
    }

    if (rules.negativeMarking && rules.negativeMarks == null) {
      throw new BadRequestException(
        'negativeMarks must be provided when negativeMarking is true',
      );
    }

    if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
      throw new BadRequestException(
        'startTime must be earlier than endTime',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const createdRules = await tx.rules.create({
        data: {
          totalMarks: rules.totalMarks,
          negativeMarking: rules.negativeMarking,
          negativeMarks: rules.negativeMarks,
        },
      });

      const test = await tx.test.create({
        data: {
          name,
          orgId: user.orgId, // ALWAYS from JWT
          showResultImmediately,
          proctoringEnabled,
          startTime: startTime ? new Date(startTime) : null,
          endTime: endTime ? new Date(endTime) : null,
          durationMode: durationMode as any,
          totalDuration,
          resultPublishTime: resultPublishTime ? new Date(resultPublishTime) : null,
          rulesId: createdRules.id,
        },
      });

      // Validate sections belong to same org
      const dbSections = await tx.section.findMany({
        where: {
          id: { in: sectionIds },
          orgId: user.orgId,
        },
      });

      if (dbSections.length !== sectionIds.length) {
        throw new BadRequestException(
          'One or more sections are invalid for this organization',
        );
      }

      await tx.testSection.createMany({
        data: sections.map((section) => ({
          testId: test.id,
          sectionId: section.sectionId,
          timeLimit: section.timeLimit,
        })),
      });

      return {
        id: test.id,
        name: test.name,
        isPublished: test.isPublished,
        isActive: test.isActive,
        rules: createdRules,
        sections,
      };
    });
  }

  async findAll(user: any) {
    return this.prisma.test.findMany({
      where: {
        orgId: user.orgId,
      },
    });
  }

  async addQuestionToTest(
    testId: string,
    questionId: string,
    sectionId: string,
    user: any,
  ) {
    return this.prisma.$transaction(async (tx) => {

      const test = await tx.test.findUnique({
        where: { id: testId },
        include: { rules: true },
      });

      if (!test) {
        throw new BadRequestException('Test not found');
      }

      if (test.isPublished) {
        throw new BadRequestException('Cannot modify published test');
      }

      const question = await tx.question.findUnique({
        where: { id: questionId },
        include: { options: true },
      });

      if (!question) {
        throw new BadRequestException('Question not found');
      }

      const lastQuestion = await tx.testQuestion.findFirst({
        where: { testId, sectionId },
        orderBy: { order: 'desc' },
      });

      const newOrder = lastQuestion ? lastQuestion.order + 1 : 1;

      const negativeMarks =
        test.rules.negativeMarking
          ? test.rules.negativeMarks ?? 0
          : 0;

      const snapshot = {
        questionText: question.questionText,
        type: question.type,
        options: question.options,
      };

      return tx.testQuestion.create({
        data: {
          testId,
          sectionId,
          originalQuestionId: questionId,
          order: newOrder,
          marks: question.marks,
          negativeMarks: negativeMarks,
          snapshot,
        },
      });
    });
  }

  async getBuilder(testId: string, user: any) {
    const test = await this.prisma.test.findFirst({
      where: {
        id: testId,
        orgId: user.orgId,
      },
      include: {
        rules: true,
        sections: {
          include: {
            section: true,
          },
        },
      },
    });

    if (!test) {
      throw new BadRequestException('Test not found');
    }

    const testQuestions = await this.prisma.testQuestion.findMany({
      where: {
        testId,
      },
      orderBy: {
        order: 'asc',
      },
    });

    // Group questions by section
    const grouped: Record<string, any[]> = {};

    for (const tq of testQuestions) {
      if (!grouped[tq.sectionId]) {
        grouped[tq.sectionId] = [];
      }
      grouped[tq.sectionId].push(tq);
    }

    // Calculate totals
    let totalMarks = 0;

    const sections = test.sections.map((ts) => {
      const questions = grouped[ts.sectionId] || [];

      const sectionTotal = questions.reduce(
        (sum, q) => sum + q.marks,
        0,
      );

      totalMarks += sectionTotal;

      return {
        id: ts.sectionId,
        sectionName: ts.section.sectionName,
        timeLimit: ts.timeLimit,
        totalMarks: sectionTotal,
        questions,
      };
    });

    return {
      test: {
        id: test.id,
        name: test.name,
        isPublished: test.isPublished,
        isActive: test.isActive,
        durationMode: test.durationMode,
        totalDuration: test.totalDuration,
        resultPublishTime: test.resultPublishTime,
      },
      rules: test.rules,
      sections,
      summary: {
        totalMarks,
        totalQuestions: testQuestions.length,
      },
    };
  }

  async removeQuestion(
    testId: string,
    testQuestionId: string,
    user: any,
  ) {
    const test = await this.prisma.test.findFirst({
      where: {
        id: testId,
        orgId: user.orgId,
      },
    });

    if (!test) {
      throw new BadRequestException('Test not found');
    }

    if (test.isPublished) {
      throw new BadRequestException('Cannot modify published test');
    }

    await this.prisma.testQuestion.delete({
      where: { id: testQuestionId },
    });

    return { message: 'Question removed successfully' };
  }
  async reorderQuestion(
    testQuestionId: string,
    newOrder: number,
    user: any,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const question = await tx.testQuestion.findUnique({
        where: { id: testQuestionId },
      });

      if (!question) {
        throw new BadRequestException('Question not found');
      }

      const test = await tx.test.findFirst({
        where: {
          id: question.testId,
          orgId: user.orgId,
        },
      });

      if (!test) {
        throw new BadRequestException('Test not found');
      }

      if (test.isPublished) {
        throw new BadRequestException('Cannot modify published test');
      }

      const currentOrder = question.order;

      if (newOrder === currentOrder) {
        return { message: 'Order unchanged' };
      }

      const questions = await tx.testQuestion.findMany({
        where: {
          testId: question.testId,
          sectionId: question.sectionId,
        },
      });

      const maxOrder = questions.length;

      if (newOrder < 1 || newOrder > maxOrder) {
        throw new BadRequestException('Invalid order position');
      }

      if (newOrder < currentOrder) {
        // Move up
        await tx.testQuestion.updateMany({
          where: {
            testId: question.testId,
            sectionId: question.sectionId,
            order: {
              gte: newOrder,
              lt: currentOrder,
            },
          },
          data: {
            order: { increment: 1 },
          },
        });
      } else {
        // Move down
        await tx.testQuestion.updateMany({
          where: {
            testId: question.testId,
            sectionId: question.sectionId,
            order: {
              gt: currentOrder,
              lte: newOrder,
            },
          },
          data: {
            order: { decrement: 1 },
          },
        });
      }

      await tx.testQuestion.update({
        where: { id: testQuestionId },
        data: { order: newOrder },
      });

      return { message: 'Reordered successfully' };
    });
  }

  async togglePublish(
    testId: string,
    isPublished: boolean,
    user: any,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const test = await tx.test.findFirst({
        where: {
          id: testId,
          orgId: user.orgId,
        },
        include: {
          rules: true,
          sections: true,
        },
      });

      if (!test) {
        throw new BadRequestException('Test not found');
      }

      // If publishing, validate structure
      if (isPublished) {
        const questionCount = await tx.testQuestion.count({
          where: { testId },
        });

        if (questionCount === 0) {
          throw new BadRequestException(
            'Cannot publish test without questions',
          );
        }

        const totalMarks = await tx.testQuestion.aggregate({
          where: { testId },
          _sum: { marks: true },
        });

        if (!totalMarks._sum.marks || totalMarks._sum.marks <= 0) {
          throw new BadRequestException(
            'Total marks must be greater than 0',
          );
        }

        if (!test.sections.length) {
          throw new BadRequestException(
            'Attach at least one section before publishing',
          );
        }
      }

      const updated = await tx.test.update({
        where: { id: testId },
        data: { isPublished },
      });

      return {
        message: isPublished
          ? 'Test published successfully'
          : 'Test unpublished successfully',
        test: updated,
      };
    });
  }

  async toggleActive(
    testId: string,
    isActive: boolean,
    user: any,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const test = await tx.test.findFirst({
        where: {
          id: testId,
          orgId: user.orgId,
        },
      });

      if (!test) {
        throw new BadRequestException('Test not found');
      }

      // Must be published before activating
      if (isActive && !test.isPublished) {
        throw new BadRequestException(
          'Cannot activate an unpublished test',
        );
      }

      // Optional: Validate start & end time
      if (isActive) {
        if (!test.startTime || !test.endTime) {
          throw new BadRequestException(
            'Start time and end time must be set before activating',
          );
        }

        if (new Date(test.startTime) >= new Date(test.endTime)) {
          throw new BadRequestException(
            'Invalid test schedule',
          );
        }
      }

      const updated = await tx.test.update({
        where: { id: testId },
        data: { isActive },
      });

      return {
        message: isActive
          ? 'Test activated successfully'
          : 'Test deactivated successfully',
        test: updated,
      };
    });
  }

  async previewTest(testId: string, user: any) {
    const test = await this.prisma.test.findFirst({
      where: {
        id: testId,
        orgId: user.orgId,
      },
      include: {
        rules: true,
        sections: {
          include: {
            section: true,
          },
        },
      },
    });

    if (!test) {
      throw new BadRequestException('Test not found');
    }

    if (!test.isPublished) {
      throw new BadRequestException(
        'Only published tests can be previewed',
      );
    }

    const testQuestions = await this.prisma.testQuestion.findMany({
      where: {
        testId,
      },
      orderBy: {
        order: 'asc',
      },
    });

    // Group by section
    const grouped: Record<string, any[]> = {};

    for (const tq of testQuestions) {
      if (!grouped[tq.sectionId]) {
        grouped[tq.sectionId] = [];
      }

      const snapshot = tq.snapshot as any;

      // Remove correct answer flags if present
      if (snapshot?.options) {
        snapshot.options = snapshot.options.map((opt: any) => ({
          text: opt.text,
        }));
      }

      grouped[tq.sectionId].push({
        id: tq.id,
        order: tq.order,
        marks: tq.marks,
        negativeMarks: tq.negativeMarks,
        questionText: snapshot?.questionText,
        type: snapshot?.type,
        options: snapshot?.options || [],
      });
    }

    const sections = test.sections.map((ts) => ({
      id: ts.sectionId,
      sectionName: ts.section.sectionName,
      timeLimit: ts.timeLimit,
      questions: grouped[ts.sectionId] || [],
    }));

    return {
      test: {
        id: test.id,
        name: test.name,
        showResultImmediately: test.showResultImmediately,
        startTime: test.startTime,
        endTime: test.endTime,
        durationMode: test.durationMode,
        totalDuration: test.totalDuration,
        resultPublishTime: test.resultPublishTime,
      },
      rules: {
        negativeMarking: test.rules.negativeMarking,
        negativeMarks: test.rules.negativeMarks,
      },
      sections,
    };
  }
}
