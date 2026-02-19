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
    // 1️⃣ Get student
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    // 2️⃣ Validate test exists
    const test = await this.prisma.test.findUnique({
      where: { id: testId },
    });

    if (!test) {
      throw new NotFoundException('Test not found');
    }

    // 3️⃣ Prevent duplicate submission
    const existing = await this.prisma.submission.findFirst({
      where: {
        studentId: student.id,
        testId,
      },
    });

    if (existing) {
      return existing;
    }

    // 4️⃣ Create submission
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
    // 1️⃣ Fetch submission with ownership data
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        student: {
          include: { user: true },
        },
        answers: true,
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // 2️⃣ Ownership validation
    if (submission.student.user.id !== userId) {
      throw new ForbiddenException('Unauthorized access');
    }

    // 3️⃣ Fetch test → sections → questions
    const test = await this.prisma.test.findUnique({
      where: { id: submission.testId },
      include: {
        sections: {
          include: {
            section: {
              include: { questions: true },
            },
          },
        },
      },
    });

    if (!test) {
      throw new NotFoundException('Test not found');
    }

    // Flatten questions
    const questions = test.sections.flatMap(
      (ts) => ts.section.questions,
    );

    const question = questions.find(
      (q) => q.id === dto.questionId,
    );

    if (!question) {
      throw new BadRequestException(
        'Invalid question for this test',
      );
    }

    // 4️⃣ Prevent duplicate answer
    const existing = await this.prisma.submissionAnswer.findFirst({
      where: {
        submissionId,
        questionId: dto.questionId,
      },
    });

    if (existing) {
      throw new BadRequestException('Answer already submitted');
    }

    // 5️⃣ Auto evaluation (MCQ only)
    const isCorrect =
      question.correctAnswer !== null &&
      String(dto.selectedAnswer) ===
        String(question.correctAnswer);

    const marksObtained = isCorrect ? 1 : 0; // 🔹 No marks field in schema

    const answer = await this.prisma.submissionAnswer.create({
      data: {
        submissionId,
        questionId: dto.questionId,
        selectedAnswer: String(dto.selectedAnswer),
        isCorrect,
        marksObtained,
      },
    });

    // 6️⃣ Update total score
    const total = await this.prisma.submissionAnswer.aggregate({
      where: { submissionId },
      _sum: { marksObtained: true },
    });

    await this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        score: total._sum.marksObtained ?? 0,
      },
    });

    return answer;
  }
}
