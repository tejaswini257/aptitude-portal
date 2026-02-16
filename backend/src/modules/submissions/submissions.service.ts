import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmitAnswerDto } from './dto';

@Injectable()
export class SubmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  // ============ START TEST ============
  async startSubmission(testId: string, userId: string) {
    // 🔹 FIX: find student via related User (NOT by userId directly)
    const student = await this.prisma.student.findFirst({
      where: {
        user: { id: userId },
      },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    const test = await this.prisma.test.findUnique({
      where: { id: testId },
    });

    if (!test) {
      throw new NotFoundException('Test not found');
    }

    const existing = await this.prisma.submission.findFirst({
      where: {
        studentId: student.id,
        testId,
      },
    });

    if (existing) return existing;

    // 🔹 Create new submission (no hardcoded score = 0)
    return this.prisma.submission.create({
      data: {
        studentId: student.id,
        testId,
      },
    });
  }

  // ============ SUBMIT ANSWER ============
  async submitAnswer(
  submissionId: string,
  dto: SubmitAnswerDto,
  userId: string,
) {
  const submission = await this.prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      student: { include: { user: true } },
      test: { include: { rules: true } },
    },
  });

  if (!submission)
    throw new NotFoundException("Submission not found");

  if (submission.student.user.id !== userId)
    throw new ForbiddenException("Unauthorized access");

  const test = submission.test;
  const now = new Date();
  if (submission.status !== "IN_PROGRESS") {
  throw new BadRequestException("Test already submitted");
}

  if (!test.isPublished || !test.isActive)
    throw new BadRequestException("Test not active");

  if (test.startTime && now < test.startTime)
    throw new BadRequestException("Test not started");

  if (test.endTime && now > test.endTime)
    throw new BadRequestException("Test ended");

  const question = await this.prisma.question.findUnique({
    where: { id: dto.questionId },
  });

  if (!question)
    throw new BadRequestException("Invalid question");

  const alreadyAnswered = await this.prisma.submissionAnswer.findFirst({
    where: {
      submissionId,
      questionId: dto.questionId,
    },
  });

  if (alreadyAnswered)
    throw new BadRequestException("Already answered");

  const rules = test.rules;

  const isCorrect =
    String(dto.selectedAnswer) ===
    String(question.correctAnswer ?? "");

  let marksObtained = 0;

  if (isCorrect) {
    marksObtained =
      question.marks ?? rules.marksPerQuestion;
  } else if (rules.negativeMarking && rules.negativeMarks) {
    marksObtained = -rules.negativeMarks;
  }

  await this.prisma.submissionAnswer.create({
    data: {
      submissionId,
      questionId: question.id,
      selectedAnswer: String(dto.selectedAnswer),
      isCorrect,
      marksObtained,
    },
  });

  await this.prisma.submission.update({
    where: { id: submissionId },
    data: {
      score: {
        increment: marksObtained,
      },
    },
  });

  return { success: true };
}

  // ============ STUDENT SUBMISSIONS ============
  async getSubmissionsByUser(userId: string) {
    // 🔹 FIX: again, find student via related User
    const student = await this.prisma.student.findFirst({
      where: {
        user: { id: userId },
      },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    const submissions = await this.prisma.submission.findMany({
  where: {
    studentId: student.id,
  },
  include: {
    test: true,
  },
});


    return submissions.map((s) => ({
  id: s.id,
  testId: s.testId,
  studentId: s.studentId,
  score: s.score,
  submittedAt: s.submittedAt,
}));
  }

  async submitBulk(
    submissionId: string,
    answers: { questionId: string; selectedAnswer: string }[],
    userId: string,
  ) {
    for (const a of answers) {
      await this.submitAnswer(
        submissionId,
        { questionId: a.questionId, selectedAnswer: a.selectedAnswer },
        userId,
      );
    }
    return this.finishSubmission(submissionId, userId);
  }

  async finishSubmission(submissionId: string, userId: string) {
  const submission = await this.prisma.submission.findUnique({
    where: { id: submissionId },
    include: { student: { include: { user: true } } },
  });

  if (!submission)
    throw new NotFoundException("Submission not found");

  if (submission.student.user.id !== userId)
    throw new ForbiddenException("Unauthorized");

  if (submission.status !== "IN_PROGRESS")
    throw new BadRequestException("Already submitted");

  return this.prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: "SUBMITTED",
    },
  });
}
}
