import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmitAnswerDto } from './dto';

@Injectable()
export class SubmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  // -----------------------------
  // START SUBMISSION
  // -----------------------------
  async startSubmission(testId: string, userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
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

    // Prevent duplicate attempt (optional safety)
    const existing = await this.prisma.submission.findFirst({
      where: {
        studentId: student.id,
        testId,
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.submission.create({
      data: {
        studentId: student.id,
        testId,
        score: 0,
      },
    });
  }

  // -----------------------------
  // SUBMIT ANSWER
  // -----------------------------
  async submitAnswer(
    submissionId: string,
    dto: SubmitAnswerDto,
    userId: string,
  ) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      include: { student: true },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // Ownership validation
    if (submission.student.userId !== userId) {
      throw new ForbiddenException('Unauthorized access');
    }

    // Fetch questions via TestSection -> Section -> Question
    const testSections = await this.prisma.testSection.findMany({
      where: { testId: submission.testId },
      include: {
        section: { include: { questions: true } },
      } as any,
    });

    const tsWithSection = testSections as Array<{
      section?: { questions: Array<{ id: string; correctAnswer?: string | null }> };
    }>;
    const questions = tsWithSection.flatMap((ts) => ts.section?.questions ?? []);
    const question = questions.find((q) => q.id === dto.questionId);

    if (!question) {
      throw new BadRequestException('Invalid question for this test');
    }

    // Prevent duplicate answer
    const existing = await this.prisma.submissionAnswer.findFirst({
      where: {
        submissionId,
        questionId: dto.questionId,
      },
    });

    if (existing) {
      throw new BadRequestException('Answer already submitted');
    }

    // -----------------------------
    // AUTO EVALUATION (MCQ)
    // -----------------------------
    const isCorrect =
      String(dto.selectedAnswer) === String(question.correctAnswer ?? '');

    const marksObtained = isCorrect ? 1 : 0;

    const answer = await this.prisma.submissionAnswer.create({
      data: {
        submissionId,
        questionId: dto.questionId,
        selectedAnswer: String(dto.selectedAnswer),
        isCorrect,
        marksObtained,
      },
    });

    // -----------------------------
    // UPDATE TOTAL SCORE
    // -----------------------------
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

    return answer;
  }
}

