import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  // Create test (schema: name, orgId, rulesId, showResultImmediately, proctoringEnabled)
  async create(
    dto: CreateTestDto,
    _userId: string,
    organizationId?: string | null,
  ) {
    const orgId = organizationId ?? '';
    if (!orgId) {
      throw new Error('organizationId (orgId) is required to create a test');
    }

    const { randomUUID } = await import('crypto');
    const rules = await this.prisma.rules.create({
      data: {
        id: randomUUID(),
        totalMarks: 0,
        marksPerQuestion: 1,
        negativeMarking: false,
        negativeMarks: null,
      },
    });

    return this.prisma.test.create({
      data: {
        name: dto.name,
        orgId,
        rulesId: rules.id,
        showResultImmediately: dto.showResultImmediately ?? false,
        proctoringEnabled: dto.proctoringEnabled ?? false,
      },
    });
  }

  // ✅ GET ALL
  async findAll(orgId: string) {
    return this.prisma.test.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
      include: {
        Rules: true,
        sections: true,
      },
    });
  }

  // ✅ GET ONE
  async findOne(id: string, orgId: string) {
    const test = await this.prisma.test.findFirst({
      where: {
        id,
        orgId,
      },
      include: {
        Rules: true,
        sections: true,
      },
    });

    if (!test) throw new NotFoundException('Test not found');

    return test;
  }

  // UPDATE (only schema fields)
  async update(id: string, dto: UpdateTestDto) {
    const data: Record<string, unknown> = {};
    if (dto.name != null) data.name = dto.name;
    if (dto.showResultImmediately != null)
      data.showResultImmediately = dto.showResultImmediately;
    if (dto.proctoringEnabled != null)
      data.proctoringEnabled = dto.proctoringEnabled;
    return this.prisma.test.update({
      where: { id },
      data: data as any,
    });
  }

  // ✅ DELETE
  async remove(id: string, orgId: string) {
    const test = await this.prisma.test.findFirst({
      where: { id, orgId },
    });

    if (!test) throw new NotFoundException('Test not found');

    return this.prisma.test.delete({
      where: { id },
    });
  }

  async getQuestionsForTest(testId: string) {
  const testSections = await this.prisma.testSection.findMany({
    where: { testId },
    include: {
      Section: {
        include: {
          questions: true,
        },
      },
    },
  });

  return testSections.map(ts => ({
    sectionId: ts.sectionId,
    sectionName: (ts.Section as any)?.name || 'Section',
    questions: ts.Section?.questions || [],
  }));
}


}
