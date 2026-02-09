import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

<<<<<<< HEAD
  // ✅ CREATE TEST
  async create(dto: any, orgId: string) {
    return this.prisma.test.create({
      data: {
        name: dto.name,
        orgId: orgId,
        showResultImmediately: dto.showResultImmediately ?? false,
        proctoringEnabled: dto.proctoringEnabled ?? false,
        rulesId: dto.rulesId,
=======
  // ✅ CREATE (optionally link to company org via organizationId)
  async create(
    dto: CreateTestDto,
    userId: string,
    organizationId?: string | null,
  ) {
    return this.prisma.test.create({
      data: {
        name: dto.name,
        type: dto.type,
        duration: dto.duration,
        showResultImmediately: dto.showResultImmediately,
        proctoringEnabled: dto.proctoringEnabled,
        status: TestStatus.DRAFT,
        createdById: userId,
        ...(organizationId && { organizationId }),
>>>>>>> cb51ccf3a1369e3b0530bab8797a5aa8db0cfdbb
      },
    });
  }

<<<<<<< HEAD
  // ✅ GET ALL TESTS
  async findAll(orgId: string) {
    return this.prisma.test.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
      include: {
        rules: true,
        sections: true,
      },
    });
  }

  // ✅ GET SINGLE TEST
  async findOne(id: string, orgId: string) {
    return this.prisma.test.findFirst({
      where: {
        id,
        orgId,
      },
      include: {
        rules: true,
        sections: true,
      },
=======
  // ✅ READ ALL – raw SQL; try snake_case (created_by_id, created_at) then camelCase
  async findAll(organizationId?: string | null) {
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
      if (organizationId) {
        rows = await this.prisma.$queryRawUnsafe<RowSnake[]>(
          `${baseSelectSnake} WHERE t.organization_id = $1 ${orderBySnake}`,
          organizationId,
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
        if (organizationId) {
          rows = await this.prisma.$queryRawUnsafe<RowCamel[]>(
            `${baseSelectCamel} WHERE t."organizationId" = $1 ORDER BY t."createdAt" DESC`,
            organizationId,
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
>>>>>>> cb51ccf3a1369e3b0530bab8797a5aa8db0cfdbb
    });
  }
}
