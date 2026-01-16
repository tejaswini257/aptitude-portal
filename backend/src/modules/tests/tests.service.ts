import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { TestStatus } from '@prisma/client';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  // ✅ CREATE
  async create(dto: CreateTestDto, userId: string) {
    return this.prisma.test.create({
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type,
        duration: dto.duration,
        showResultImmediately: dto.showResultImmediately,
        proctoringEnabled: dto.proctoringEnabled,
        status: TestStatus.DRAFT,
        createdById: userId,
      },
    });
  }

  // ✅ READ ALL
  async findAll() {
    return this.prisma.test.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: { id: true, email: true, role: true },
        },
      },
    });
  }

  // ✅ READ ONE
  async findOne(id: string) {
    const test = await this.prisma.test.findUnique({
      where: { id },
    });

    if (!test) {
      throw new NotFoundException('Test not found');
    }

    return test;
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
}
