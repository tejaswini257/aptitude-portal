import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';

@Injectable()
export class CollegesService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.college.findMany();
  }

  async getById(id: string) {
    const college = await this.prisma.college.findUnique({
      where: { id },
    });

    if (!college) {
      throw new NotFoundException('College not found');
    }

    return college;
  }

  async create(dto: CreateCollegeDto) {
    return this.prisma.college.create({
      data: {
        ...dto,
      },
    });
  }

  async update(id: string, dto: UpdateCollegeDto) {
    await this.getById(id); // ensures exists

    return this.prisma.college.update({
      where: { id },
      data: dto,
    });
  }
}
