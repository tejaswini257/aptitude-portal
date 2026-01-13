import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CollegeService {
  constructor(private prisma: PrismaService) {}

  // ✅ CREATE COLLEGE
  async create(dto: any) {
    return this.prisma.college.create({
      data: dto,
    });
  }

  // ✅ GET ALL COLLEGES
  findAll() {
    return this.prisma.college.findMany();
  }

  // ✅ APPROVE COLLEGE
  async approveCollege(id: string) {
    return this.prisma.college.update({
      where: { id },
      data: {
        isApproved: true,
      },
    });
  }
}