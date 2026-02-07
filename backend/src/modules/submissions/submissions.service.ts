import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  // ✅ CREATE SUBMISSION
  async create(testId: string, studentId: string) {
    return this.prisma.submission.create({
      data: {
        testId,
        studentId,
      },
    });
  }

  // ✅ GET SUBMISSION
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

  // ✅ UPDATE SCORE
  async updateScore(id: string, score: number) {
    return this.prisma.submission.update({
      where: { id },
      data: { score },
    });
  }
}
