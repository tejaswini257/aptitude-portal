import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Injectable()
export class TestsService {
  constructor(private readonly prisma: PrismaService) {}

  // -----------------------------
  // CREATE TEST
  // -----------------------------
  async create(dto: CreateTestDto) {
    return this.prisma.test.create({
      data: {
        name: dto.name,

        showResultImmediately: dto.showResultImmediately ?? false,
        proctoringEnabled: dto.proctoringEnabled ?? false,

        // REQUIRED relations (as per Prisma schema)
        organization: {
          connect: { id: dto.orgId },
        },

        rules: {
          connect: { id: dto.rulesId },
        },
      },
    });
  }

  // -----------------------------
  // GET ALL TESTS
  // -----------------------------
  async findAll(orgId?: string) {
    return this.prisma.test.findMany({
      where: orgId ? { orgId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        organization: true,
        rules: true,
      },
    });
  }

  // -----------------------------
  // GET SINGLE TEST
  // -----------------------------
  async findOne(id: string) {
    const test = await this.prisma.test.findUnique({
      where: { id },
      include: {
        organization: true,
        rules: true,
      },
    });

    if (!test) {
      throw new NotFoundException('Test not found');
    }

    return test;
  }

  // -----------------------------
  // UPDATE TEST
  // -----------------------------
  async update(id: string, dto: UpdateTestDto) {
    const exists = await this.prisma.test.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('Test not found');
    }

    return this.prisma.test.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),

        ...(dto.showResultImmediately !== undefined && {
          showResultImmediately: dto.showResultImmediately,
        }),

        ...(dto.proctoringEnabled !== undefined && {
          proctoringEnabled: dto.proctoringEnabled,
        }),

        ...(dto.rulesId && {
          rules: {
            connect: { id: dto.rulesId },
          },
        }),
      },
    });
  }

  // -----------------------------
  // DELETE TEST
  // -----------------------------
  async remove(id: string) {
    const exists = await this.prisma.test.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('Test not found');
    }

    return this.prisma.test.delete({
      where: { id },
    });
  }
}
