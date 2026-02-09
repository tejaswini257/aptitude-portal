import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  // =============================
  // START SUBMISSION
  // =============================
  async startSubmission(testId: string, studentId: string) {
    return this.prisma.submission.create({
      data: {
        testId,
        studentId,
      },
    });
  }

  // =============================
  // SUBMIT ANSWER
  // =============================
  async submitAnswer(
    submissionId: string,
    dto: any,
    userId: string,
  ) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // Create or update answer
    return this.prisma.submissionAnswer.upsert({
      where: {
        submissionId_questionId: {
          submissionId,
          questionId: dto.questionId,
        },
      },
      update: {
        selectedAnswer: dto.selectedAnswer,
      },
      create: {
        submissionId,
        questionId: dto.questionId,
        selectedAnswer: dto.selectedAnswer,
      },
    });
  }

  // =============================
  // GET SUBMISSION
  // =============================
  async findOne(id: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: {
        student: true,
        answers: true,
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    return submission;
  }

  // =============================
  // UPDATE SCORE
  // =============================
  async updateScore(id: string, score: number) {
    return this.prisma.submission.update({
      where: { id },
      data: { score },
    });
  }
}
