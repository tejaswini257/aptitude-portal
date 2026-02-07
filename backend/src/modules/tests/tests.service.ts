import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  // ✅ CREATE TEST
  async create(dto: any, orgId: string) {
    return this.prisma.test.create({
      data: {
        name: dto.name,
        orgId: orgId,
        showResultImmediately: dto.showResultImmediately ?? false,
        proctoringEnabled: dto.proctoringEnabled ?? false,
        rulesId: dto.rulesId,
      },
    });
  }

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
    });
  }
}
