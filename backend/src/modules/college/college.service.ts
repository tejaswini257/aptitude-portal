import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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

  async update(id: string, dto: UpdateCollegeDto, orgId: string) {
  const college = await this.prisma.college.findUnique({
    where: { id },
  });

  if (!college) throw new NotFoundException('College not found');

  if (college.orgId !== orgId) {
    throw new ForbiddenException('Access denied');
  }

  return this.prisma.college.update({
    where: { id },
    data: dto,
  });
}


 async delete(id: string, orgId: string) {
  const college = await this.prisma.college.findUnique({
    where: { id },
  });

  if (!college) throw new NotFoundException('College not found');

  if (college.orgId !== orgId) {
    throw new ForbiddenException('Access denied');
  }

  return this.prisma.college.delete({
    where: { id },
  });
}
}
