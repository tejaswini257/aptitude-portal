import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  // ✅ CREATE
  async create(dto: any, orgId: string) {
    return this.prisma.test.create({
      data: {
        name: dto.name,
        orgId,
        showResultImmediately: dto.showResultImmediately ?? false,
        proctoringEnabled: dto.proctoringEnabled ?? false,
        rulesId: dto.rulesId,
      },
    });
  }

  // ✅ GET ALL
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

  // ✅ GET ONE
  async findOne(id: string, orgId: string) {
    const test = await this.prisma.test.findFirst({
      where: {
        id,
        orgId,
      },
      include: {
        rules: true,
        sections: true,
      },
    });

    if (!test) throw new NotFoundException('Test not found');

    return test;
  }

  // ✅ UPDATE
  async update(id: string, dto: any, orgId: string) {
    const test = await this.prisma.test.findFirst({
      where: { id, orgId },
    });

    if (!test) throw new NotFoundException('Test not found');

    return this.prisma.test.update({
      where: { id },
      data: dto,
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
}
