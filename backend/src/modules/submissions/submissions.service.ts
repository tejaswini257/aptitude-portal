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
        status: 'IN_PROGRESS',
        score: 0,
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
        student: true,
        test: {
          include: {
            sections: {
              include: {
                section: {
                  include: {
                    questions: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (submission.student.userId !== userId) {
      throw new ForbiddenException('Unauthorized access');
    }

    // 🔁 Flatten all questions from sections
    const allQuestions = submission.test.sections.flatMap(
      (ts) => ts.section.questions,
    );

    const question = allQuestions.find(
      (q) => q.id === dto.questionId,
    );

    if (!question) {
      throw new BadRequestException('Invalid question for this test');
    }

    const existing = await this.prisma.submissionAnswer.findFirst({
      where: {
        submissionId,
        questionId: dto.questionId,
      },
    });

    if (existing) {
      throw new BadRequestException('Answer already submitted');
    }

    const isCorrect =
      String(dto.selectedAnswer) ===
      String(question.correctAnswer);

    const marksObtained = isCorrect ? question.marks : 0;

    const answer = await this.prisma.submissionAnswer.create({
      data: {
        submissionId,
        questionId: dto.questionId,
        selectedAnswer: String(dto.selectedAnswer),
        isCorrect,
        marksObtained,
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

    return answer;
  }

  // ================= SUBMIT BULK =================
  async submitBulk(
    submissionId: string,
    answers: SubmitAnswerDto[],
    userId: string,
  ) {
    const results: any[] = [];


    for (const answer of answers) {
      const res = await this.submitAnswer(
        submissionId,
        answer,
        userId,
      );
      results.push(res);
    }

    return results;
  }

  // ================= GET SUBMISSIONS BY USER =================
  async getSubmissionsByUser(userId: string) {
    return this.prisma.submission.findMany({
      where: {
        student: {
          userId,
        },
      },
      include: {
        test: true,
      },
    });
  }

  // ================= FINISH SUBMISSION =================
  async finishSubmission(submissionId: string, userId: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        student: true,
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (submission.student.userId !== userId) {
      throw new ForbiddenException('Unauthorized');
    }

    return this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
    });
  }
}
