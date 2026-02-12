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

  // ================= START TEST =================
  async startSubmission(testId: string, userId: string) {
    const student = await this.prisma.student.findFirst({
      where: { user: { id: userId } },
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

    return this.prisma.submission.create({
      data: {
        studentId: student.id,
        testId,
      },
    });
  }

  // ================= SUBMIT ANSWER =================
  async submitAnswer(
    submissionId: string,
    dto: SubmitAnswerDto,
    userId: string,
  ) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        student: {
          include: { user: true },
        },
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (submission.student.user.id !== userId) {
      throw new ForbiddenException('Unauthorized access');
    }

    const testSections = await this.prisma.testSection.findMany({
      where: { testId: submission.testId },
      include: {
        section: {
          include: { questions: true },
        },
      },
    });

    const questions = testSections.flatMap(
      (ts) => ts.section?.questions ?? [],
    );

    const question = questions.find(
      (q) => q.id === dto.questionId,
    );

    if (!question) {
      throw new BadRequestException('Invalid question');
    }

    const alreadyAnswered =
      await this.prisma.submissionAnswer.findFirst({
        where: {
          submissionId,
          questionId: dto.questionId,
        },
      });

    if (alreadyAnswered) {
      throw new BadRequestException('Answer already submitted');
    }

    const isCorrect =
      String(dto.selectedAnswer) ===
      String(question.correctAnswer ?? '');

    await this.prisma.submissionAnswer.create({
      data: {
        submissionId,
        questionId: dto.questionId,
        selectedAnswer: String(dto.selectedAnswer),
        isCorrect,
        marksObtained: isCorrect ? 1 : 0,
      },
    });

    const total = await this.prisma.submissionAnswer.aggregate({
      where: { submissionId },
      _sum: { marksObtained: true },
    });

    await this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        score: total._sum.marksObtained || 0,
      },
    });

    return { success: true };
  }

  // ================= GET STUDENT SUBMISSIONS =================
  async getSubmissionsByUser(userId: string) {
    const student = await this.prisma.student.findFirst({
      where: { user: { id: userId } },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    const submissions = await this.prisma.submission.findMany({
      where: { studentId: student.id },
      orderBy: { submittedAt: 'desc' },
    });

    // 🔥 Manually fetch test details (NO include relation)
    const result = await Promise.all(
      submissions.map(async (s) => {
        const test = await this.prisma.test.findUnique({
          where: { id: s.testId },
          select: { id: true, name: true },
        });

        return {
          id: s.id,
          testId: s.testId,
          score: s.score,
          submittedAt: s.submittedAt,
          test: test || null,
        };
      }),
    );

    return result;
  }
}
