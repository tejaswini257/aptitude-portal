import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { randomUUID } from 'crypto';


@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  // Create test (schema: name, orgId, rulesId, showResultImmediately, proctoringEnabled)
  async create(dto: CreateTestDto, orgId: string) {
  if (!orgId) {
    throw new BadRequestException(
      'orgId is required to create a test. Log in as a College Admin or Company Admin.',
    );
  }

  // 1️⃣ Create default rules (Prisma auto-generates ID)
  const rules = await this.prisma.rules.create({
    data: {
      id: randomUUID(),
      totalMarks: 0,
      marksPerQuestion: 1,
      negativeMarking: false,
      negativeMarks: null,
    },
  });

  // 2️⃣ Create test linked to org + rules
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
    const include = { rules: true, sections: true };
    return this.prisma.test.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
      include: include as any,
    });
  }

  // ✅ GET ONE
  async findOne(id: string, orgId: string) {
    const include = { rules: true, sections: true };
    const test = await this.prisma.test.findFirst({
      where: { id, orgId },
      include: include as any,
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
    const include = {
      section: { include: { questions: true } },
    };
    const testSections = await this.prisma.testSection.findMany({
      where: { testId },
      include: include as any,
    });

    return testSections.map((ts: any) => ({
      sectionId: ts.sectionId,
      sectionName: ts.section?.sectionName || 'Section',
      questions: ts.section?.questions || [],
    }));
  }



}
