import { Injectable, NotFoundException,  BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreatorRole } from '@prisma/client';
import { QuestionType, DifficultyLevel } from '@prisma/client';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}
  

  // ============================================
  // CREATE QUESTION
  // ============================================
  async create(dto: any, user: any) {
  // 🔹 Map role
  let mappedRole: CreatorRole;

  if (user.role === 'COLLEGE_ADMIN' || user.role === 'SUPER_ADMIN') {
    mappedRole = CreatorRole.ADMIN;
  } else if (user.role === 'COMPANY_ADMIN') {
    mappedRole = CreatorRole.COMPANY;
  } else {
    throw new Error('Invalid role for question creation');
  }

  // 🔹 Determine next order
  const lastQuestion = await this.prisma.question.findFirst({
    where: { sectionId: dto.sectionId },
    orderBy: { order: 'desc' },
  });

  const nextOrder = lastQuestion ? lastQuestion.order + 1 : 1;

  // =====================================================
  // 🔥 CODING QUESTION BRANCH
  // =====================================================
  if (dto.type === 'CODING') {
    const section = await this.prisma.section.findUnique({
      where: { id: dto.sectionId },
    });

    if (!section) {
      throw new NotFoundException("Section not found");
    }
    return this.prisma.question.create({
      data: {
        sectionId: dto.sectionId,
        orgId: section.orgId,
        type: 'CODING',
        difficulty: dto.difficulty,
        questionText: dto.questionText,
        allowedFor: dto.allowedFor ?? "BOTH",
        createdBy: user.userId ?? user.id,
        creatorRole: mappedRole,
        marks: dto.marks,
        order: nextOrder,

        codingQuestion: {
          create: {
            constraints: dto.codingMeta?.constraints ?? "",
            inputFormat: dto.codingMeta?.inputFormat ?? "",
            outputFormat: dto.codingMeta?.outputFormat ?? "",
            sampleInput: dto.codingMeta?.sampleInput ?? "",
            sampleOutput: dto.codingMeta?.sampleOutput ?? "",
            testCases: dto.codingMeta?.testCases ?? [],   // 🔥 FIX HERE
            timeLimitMs: dto.codingMeta?.timeLimitMs ?? 1000,
            memoryLimitMb: dto.codingMeta?.memoryLimitMb ?? 256,
            allowedLanguages: dto.codingMeta?.allowedLanguages ?? [],
          },
        },
      },
      include: {
        codingQuestion: true,
      },
    });
  }

  // =====================================================
  // 🔥 MCQ QUESTION BRANCH
  // =====================================================

  if (dto.type === 'MCQ_SINGLE' || dto.type === 'MCQ_MULTIPLE') {

  return this.prisma.question.create({
    data: {
      sectionId: dto.sectionId,
      parentQuestionId: dto.parentQuestionId ?? null, // 👈 ADD THIS
      orgId: user.orgId,
      type: dto.type,
      difficulty: dto.difficulty,
      questionText: dto.questionText,
      allowedFor: dto.allowedFor ?? "BOTH",
      createdBy: user.userId ?? user.id,
      creatorRole: mappedRole,
      marks: dto.marks,
      order: nextOrder,

      options: {
        create: (dto.options || []).map((o: any, index: number) => ({
          optionCode: o.optionCode ?? String.fromCharCode(65 + index),
          optionText: o.text ?? o.optionText ?? '',
          isCorrect: Boolean(o.isCorrect),
        })),
      },
    },
  });
}
  
  if (dto.type === 'PASSAGE_WRITING') {

  const section = await this.prisma.section.findUnique({
    where: { id: dto.sectionId },
  });

  if (!section) {
    throw new NotFoundException('Section not found');
  }

  return this.prisma.question.create({
    data: {
      sectionId: dto.sectionId,
      orgId: section.orgId,
      type: 'PASSAGE_WRITING',
      difficulty: dto.difficulty,
      questionText: dto.questionText,
      allowedFor: dto.allowedFor ?? 'BOTH',
      createdBy: user.userId ?? user.id,
      creatorRole: mappedRole,
      marks: dto.marks,
      order: nextOrder,
      passageWritingMeta: {
        create: {
          minWords: dto.passageWritingMeta?.minWords,
          maxWords: dto.passageWritingMeta?.maxWords,
        },
      },
    },
    include: {
      passageWritingMeta: true,
    },
  });
}

if (dto.type === 'PASSAGE_DROPDOWN') {

  const section = await this.prisma.section.findUnique({
    where: { id: dto.sectionId },
  });

  if (!section) {
    throw new NotFoundException('Section not found');
  }

  const blanks = dto.passageDropdownMeta?.blanks ?? [];

  const totalBlankMarks = blanks.reduce(
    (sum, blank) => sum + (blank.marks || 0),
    0
  );

  if (totalBlankMarks !== dto.marks) {
    throw new BadRequestException(
      'Sum of blank marks must equal question marks'
    );
  }

  return this.prisma.question.create({
    data: {
      sectionId: dto.sectionId,
      orgId: section.orgId,
      type: 'PASSAGE_DROPDOWN',
      difficulty: dto.difficulty,
      questionText: dto.questionText,
      allowedFor: dto.allowedFor ?? 'BOTH',
      createdBy: user.userId ?? user.id,
      creatorRole: mappedRole,
      marks: dto.marks,
      order: nextOrder,
      passageDropdownMeta: {
        create: {
          content: dto.passageDropdownMeta.content,
          blanks: blanks,
        },
      },
    },
    include: {
      passageDropdownMeta: true,
    },
  });
}

// =====================================================
// 🔥 UNSEEN PARAGRAPH BRANCH
// =====================================================

if (dto.type === "UNSEEN_PARAGRAPH") {

  if (!dto.unseenParagraphMeta?.passage) {
    throw new BadRequestException(
      "Passage is required when creating a new unseen passage"
    );
  }

  return this.prisma.question.create({
    data: {
      sectionId: dto.sectionId,
      orgId: user.orgId,
      type: "UNSEEN_PARAGRAPH",
      difficulty: dto.difficulty ?? "EASY",
      questionText: "Read the passage and answer the questions below",
      allowedFor: dto.allowedFor ?? "BOTH",
      createdBy: user.userId ?? user.id,
      creatorRole: mappedRole,
      marks: dto.marks ?? 1,
      order: nextOrder,
      unseenParagraphMeta: {
        create: {
          passage: dto.unseenParagraphMeta.passage,
          subQuestions: dto.unseenParagraphMeta.subQuestions ?? [],
        },
      },
    },
    include: {
      unseenParagraphMeta: true,
    },
  });
}

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
        unseenParagraphMeta: true,
        parentQuestion: {
          include: {
            unseenParagraphMeta: true,
          },
        },
      },
    });
  }

  // ============================================
  // UPDATE QUESTION
  // ============================================
  async update(
  id: string,
  dto: Partial<CreateQuestionDto>,
  user: any,
) {
  const existing = await this.prisma.question.findFirst({
    where: {
      id,
      orgId: user.orgId,
    },
    include: {
      options: true,
    },
  });

  if (!existing) {
    throw new NotFoundException("Question not found");
  }

  return this.prisma.$transaction(async (tx) => {
    // If options provided → delete old options
    if (dto.options) {
      await tx.option.deleteMany({
        where: { questionId: id },
      });
    }

    const updatedQuestion = await tx.question.update({
      where: { id },
      data: {
        questionText: dto.questionText ?? existing.questionText,
        difficulty: dto.difficulty ?? existing.difficulty,
        marks: dto.marks ?? existing.marks,
        allowedFor: dto.allowedFor ?? existing.allowedFor,
        type: dto.type ?? existing.type,
      },
    });

    // Recreate options if provided
    if (dto.options) {
      await tx.option.createMany({
        data: dto.options.map((opt, index) => ({
          questionId: id,
          optionCode: String.fromCharCode(65 + index), // A, B, C...
          optionText: opt.text,
          isCorrect: opt.isCorrect,
        })),
      });
    }

    return updatedQuestion;
  });
}

  // ============================================
  // DELETE QUESTION
  // ============================================
  async delete(id: string) {
    const existing = await this.prisma.question.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Question not found');
    }

    return this.prisma.question.delete({ where: { id } });
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

  async deleteQuestion(id: string, orgId: string) {
  const question = await this.prisma.question.findFirst({
    where: { id, orgId },
  });

  if (!question) {
    throw new NotFoundException("Question not found");
  }

  return this.prisma.question.delete({
    where: { id },
  });
}

async reorderQuestion(
  id: string,
  direction: "UP" | "DOWN",
  orgId: string
) {
  const current = await this.prisma.question.findFirst({
    where: { id, orgId },
  });

  if (!current) {
    throw new NotFoundException("Question not found");
  }

  const swapWith = await this.prisma.question.findFirst({
    where: {
      sectionId: current.sectionId,
      orgId,
      order:
        direction === "UP"
          ? current.order - 1
          : current.order + 1,
    },
  });

  if (!swapWith) return current;

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

  return { message: "Reordered successfully" };
}

async findAllForBuilder(
  orgId: string,
  sectionId?: string,
  type?: string,
  difficulty?: string,
  search?: string,
) {
  return this.prisma.question.findMany({
    where: {
  orgId,
  ...(sectionId && { sectionId }),
  ...(type && { type: type as QuestionType }),
  ...(difficulty && { difficulty: difficulty as DifficultyLevel }),
  ...(search && {
    questionText: {
      contains: search,
      mode: 'insensitive',
    },
  }),
},
    include: {
      options: true,
      unseenParagraphMeta: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

async getQuestionBank(
  sectionId: string,
  type: string,
  difficulty: string,
  search: string,
  orgId: string,
) {
  return this.prisma.question.findMany({
  where: {
    orgId,
    ...(sectionId && { sectionId }),
    ...(type && { type: type as QuestionType }),
    ...(difficulty && { difficulty: difficulty as DifficultyLevel }),
    ...(search && {
      questionText: {
        contains: search,
        mode: "insensitive",
      },
    }),
  },
  orderBy: { order: "asc" },
});
}
}