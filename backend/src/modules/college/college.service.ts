import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';

@Injectable()
export class CollegesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllColleges() {
    return this.prisma.college.findMany();
  }

  async getCollegeById(id: string) {
    const college = await this.prisma.college.findUnique({
      where: { id },
    });

    if (!college) {
      throw new NotFoundException('College not found');
    }

    return college;
  }

  async createCollege(dto: CreateCollegeDto, orgId: string) {
    return this.prisma.college.create({
      data: {
        ...dto,
        orgId,
        isApproved: true,
      },
    });
  }

  async updateCollege(id: string, dto: UpdateCollegeDto) {
    await this.getCollegeById(id);

    return this.prisma.college.update({
      where: { id },
      data: {
        ...dto,
        isApproved: true,
      },
    });
  }

  async deleteCollege(id: string) {
    await this.getCollegeById(id);

    return this.prisma.college.delete({
      where: { id },
    });
  }
}

