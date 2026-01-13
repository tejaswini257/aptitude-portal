import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';

@Injectable()
export class CollegesService {
  constructor(private prisma: PrismaService) {}

  getAllColleges() {
    return this.prisma.college.findMany();
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
    return this.prisma.college.update({
      where: { id },
      data: dto,
    });
  }

  deleteCollege(id: string) {
    return this.prisma.college.delete({ where: { id } });
  }
}
