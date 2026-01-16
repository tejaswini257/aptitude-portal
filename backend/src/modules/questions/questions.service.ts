import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: dto,
    });
  }

  findByTest(testId: string) {
    return this.prisma.question.findMany({
      where: { testId },
    });
  }

  update(id: string, data: Partial<CreateQuestionDto>) {
    return this.prisma.question.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.question.delete({
      where: { id },
    });
  }
}