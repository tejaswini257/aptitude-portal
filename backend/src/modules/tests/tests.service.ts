import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { TestStatus } from '@prisma/client';

@Injectable()
export class TestsService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ CREATE (optionally link to company org via orgId)
 async create(dto: CreateTestDto, userId: string, orgId?: string) {
  if (!orgId) {
    throw new BadRequestException('Organization ID is required');
  }

  return this.prisma.test.create({
    data: {
      name: dto.name,

      showResultImmediately: dto.showResultImmediately ?? false,
      proctoringEnabled: dto.proctoringEnabled ?? false,

      isPublished: false,
      isActive: false,

      orgId: orgId, // ✅ now guaranteed string
      rulesId: dto.rulesId,

      startTime: dto.startTime ?? null,
      endTime: dto.endTime ?? null,
    },
  });
}
  // ✅ READ ALL – raw SQL; try snake_case (created_by_id, created_at) then camelCase
  async findAll(orgId?: string | null) {
    type RowSnake = {
      id: string;
      name: string;
      created_by_id: string | null;
      created_at: Date | null;
      creator_email: string | null;
    };
    type RowCamel = {
      id: string;
      name: string;
      createdById: string | null;
      createdAt: Date | null;
      creator_email: string | null;
    };
    let rows: RowSnake[] | RowCamel[];
    const baseSelectSnake = `SELECT t.id, t.name, t.created_by_id, t.created_at, u.email as "creator_email" FROM "Test" t LEFT JOIN "User" u ON u.id = t.created_by_id`;
    const orderBySnake = `ORDER BY t.created_at DESC`;
    try {
      if (orgId) {
        rows = await this.prisma.$queryRawUnsafe<RowSnake[]>(
          `${baseSelectSnake} WHERE t.organization_id = $1 ${orderBySnake}`,
          orgId,
        );
      } else {
        rows = await this.prisma.$queryRawUnsafe<RowSnake[]>(
          `${baseSelectSnake} ${orderBySnake}`,
        );
      }
      return (rows as RowSnake[]).map((t) => ({
        id: t.id,
        name: t.name,
        createdById: t.created_by_id ?? '',
        createdAt: t.created_at ?? new Date(),
        createdBy: t.creator_email ? { id: t.created_by_id ?? '', email: t.creator_email, role: null } : null,
      }));
    } catch {
      try {
        const baseSelectCamel = `SELECT t.id, t.name, t."createdById", t."createdAt", u.email as "creator_email" FROM "Test" t LEFT JOIN "User" u ON u.id = t."createdById"`;
        if (orgId) {
          rows = await this.prisma.$queryRawUnsafe<RowCamel[]>(
            `${baseSelectCamel} WHERE t."orgId" = $1 ORDER BY t."createdAt" DESC`,
            orgId,
          );
        } else {
          rows = await this.prisma.$queryRawUnsafe<RowCamel[]>(
            `${baseSelectCamel} ORDER BY t."createdAt" DESC`,
          );
        }
        return (rows as RowCamel[]).map((t) => ({
          id: t.id,
          name: t.name,
          createdById: t.createdById ?? '',
          createdAt: t.createdAt ?? new Date(),
          createdBy: t.creator_email ? { id: t.createdById ?? '', email: t.creator_email, role: null } : null,
        }));
      } catch {
        // Minimal fallback: only id and name (no creator, no dates)
        const minRows = await this.prisma.$queryRawUnsafe<Array<{ id: string; name: string }>>(
          `SELECT id, name FROM "Test" ORDER BY id`,
        );
        return minRows.map((t) => ({
          id: t.id,
          name: t.name,
          createdById: '',
          createdAt: new Date(),
          createdBy: null,
        }));
      }
    }
  }

  // ✅ READ ONE – raw SQL; try snake_case then camelCase then minimal
  async findOne(id: string) {
    try {
      const rows = await this.prisma.$queryRawUnsafe<
        Array<{ id: string; name: string; created_by_id: string | null; created_at: Date | null; creator_email: string | null }>
      >(
        `SELECT t.id, t.name, t.created_by_id, t.created_at, u.email as "creator_email" FROM "Test" t LEFT JOIN "User" u ON u.id = t.created_by_id WHERE t.id = $1`,
        id,
      );
      const row = rows[0];
      if (!row) throw new NotFoundException('Test not found');
      return {
        id: row.id,
        name: row.name,
        createdById: row.created_by_id ?? '',
        createdAt: row.created_at ?? new Date(),
        createdBy: row.creator_email ? { id: row.created_by_id ?? '', email: row.creator_email, role: null } : null,
      };
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      try {
        const rows = await this.prisma.$queryRawUnsafe<
          Array<{ id: string; name: string; createdById: string | null; createdAt: Date | null; creator_email: string | null }>
        >(
          `SELECT t.id, t.name, t."createdById", t."createdAt", u.email as "creator_email" FROM "Test" t LEFT JOIN "User" u ON u.id = t."createdById" WHERE t.id = $1`,
          id,
        );
        const row = rows[0];
        if (!row) throw new NotFoundException('Test not found');
        return {
          id: row.id,
          name: row.name,
          createdById: row.createdById ?? '',
          createdAt: row.createdAt ?? new Date(),
          createdBy: row.creator_email ? { id: row.createdById ?? '', email: row.creator_email, role: null } : null,
        };
      } catch (e2) {
        if (e2 instanceof NotFoundException) throw e2;
        const rows = await this.prisma.$queryRawUnsafe<Array<{ id: string; name: string }>>(
          `SELECT id, name FROM "Test" WHERE id = $1`,
          id,
        );
        const row = rows[0];
        if (!row) throw new NotFoundException('Test not found');
        return {
          id: row.id,
          name: row.name,
          createdById: '',
          createdAt: new Date(),
          createdBy: null,
        };
      }
    }
  }

  // ✅ UPDATE
  async update(id: string, dto: UpdateTestDto) {
    return this.prisma.test.update({
      where: { id },
      data: dto,
    });
  }

  // ✅ DELETE
  async remove(id: string) {
    return this.prisma.test.delete({
      where: { id },
    });
  }

  /** Get submissions for a test (college/company admin) - students who attempted + scores */
  async getSubmissionsForTest(testId: string, orgId: string) {
    const test = await this.prisma.test.findFirst({
      where: { id: testId, orgId },
    });
    if (!test) throw new NotFoundException('Test not found');

    const submissions = await this.prisma.submission.findMany({
      where: { testId },
      include: {
        student: {
          include: {
            user: { select: { email: true } },
            department: { select: { name: true } },
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });

    return submissions.map((s) => ({
      id: s.id,
      studentId: s.studentId,
      studentEmail: s.student?.user?.email ?? '—',
      rollNo: s.student?.rollNo ?? '—',
      department: s.student?.department?.name ?? '—',
      score: s.score,
      submittedAt: s.submittedAt,
    }));
  }

  async getQuestionsForTest(testId: string) {
    const test = await this.prisma.test.findUnique({
      where: { id: testId },
      include: {
        sections: {
          include: {
            section: {
              include: {
                questions: {
                  include: { options: true },
                },
              },
            },
          },
        },
      },
    });

    if (!test) throw new NotFoundException('Test not found');
    if (!test.isPublished || !test.isActive) {
      throw new BadRequestException('Test not available');
    }

    // Return format: [{ sectionId, sectionName, questions: [...] }]
    return (test.sections as any[]).map((ts: any) => ({
      sectionId: ts.sectionId,
      sectionName: ts.section?.sectionName ?? 'Section',
      questions: (ts.section?.questions ?? []).map((q: any) => ({
        id: q.id,
        questionText: q.questionText,
        options: (q.options ?? []).map((opt: any) => ({
          id: opt.id,
          optionCode: opt.optionCode,
          optionText: opt.optionText,
        })),
      })),
    }));
  }

  async togglePublish(id: string, orgId?: string | null) {
    const where: { id: string; orgId?: string } = { id };
    if (orgId) where.orgId = orgId;

    const test = await this.prisma.test.findFirst({ where });
    if (!test) throw new NotFoundException('Test not found');

    return this.prisma.test.update({
    where: { id },
    data: {
      isPublished: !test.isPublished,
    },
  });
}

  async toggleActive(id: string, orgId?: string | null) {
    const where: { id: string; orgId?: string } = { id };
    if (orgId) where.orgId = orgId;

    const test = await this.prisma.test.findFirst({ where });
    if (!test) throw new NotFoundException('Test not found');

    // Safety rule: cannot activate if not published
  if (!test.isPublished && !test.isActive) {
    throw new BadRequestException("Publish test before activating");
  }

  return this.prisma.test.update({
    where: { id },
    data: {
      isActive: !test.isActive,
    },
  });
}
}
