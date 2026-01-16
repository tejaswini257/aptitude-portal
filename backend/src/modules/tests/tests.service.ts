import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  // ✅ CREATE TEST
  create(dto: CreateTestDto, userId: string, orgId?: string) {
    return this.prisma.test.create({
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type,
        duration: dto.duration,
        showResultImmediately: dto.showResultImmediately ?? false,
        proctoringEnabled: dto.proctoringEnabled ?? false,
        createdById: userId,
        organizationId: orgId ?? null,
      },
    });
  }

  // ✅ GET ALL TESTS
  findAll(orgId?: string) {
    return this.prisma.test.findMany({
      where: orgId ? { organizationId: orgId } : {},
      include: {
        sections: true,
      },
    });
  }

  // ✅ GET SINGLE TEST
  async findOne(id: string) {
    const test = await this.prisma.test.findUnique({
      where: { id },
      include: { sections: true },
    });

    if (!test) {
      throw new NotFoundException('Test not found');
    }

    return test;
  }

  // ✅ UPDATE TEST
  update(id: string, dto: UpdateTestDto) {
    return this.prisma.test.update({
      where: { id },
      data: dto,
    });
  }

  // ✅ DELETE TEST
  delete(id: string) {
    return this.prisma.test.delete({
      where: { id },
    });
  }
}
