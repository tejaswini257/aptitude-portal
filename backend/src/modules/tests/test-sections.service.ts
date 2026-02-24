import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TestSectionsService {
  constructor(private prisma: PrismaService) {}

  async attachSection(
    testId: string,
    sectionId: string,
    timeLimit: number
  ) {
    return this.prisma.testSection.create({
      data: {
        testId,
        sectionId,
        timeLimit,
      },
    });
  }

  async removeSection(testSectionId: string) {
    return this.prisma.testSection.delete({
      where: { id: testSectionId },
    });
  }
}