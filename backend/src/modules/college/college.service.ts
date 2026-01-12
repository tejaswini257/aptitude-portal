import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CollegeService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.college.findMany();
  }
  async approveCollege(id: string) {
  return this.prisma.college.update({
    where: { id },
    data: {
      isApproved: true,
    },
  });
}
}