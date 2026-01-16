import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { TestStatus } from '@prisma/client';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTestDto, userId: string) {
  return this.prisma.test.create({
    data: {
      name: dto.name,
      description: dto.description,
      type: dto.type,
      duration: dto.duration,
      showResultImmediately: dto.showResultImmediately,
      proctoringEnabled: dto.proctoringEnabled,
      status: 'DRAFT',

      // ✅ FIX — pass creator properly
      createdById: userId,
    },
  });
}


  async findAll() {
    return this.prisma.test.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const test = await this.prisma.test.findUnique({ where: { id } });

    if (!test) {
      throw new NotFoundException('Test not found');
    }

    return test;
  }

  async update(id: string, dto: UpdateTestDto) {
    return this.prisma.test.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.test.delete({
      where: { id },
    });
  }
}
