import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string; collegeId: string }) {
    return this.prisma.department.create({
      data,
    });
  }

  findByCollege(collegeId: string) {
    return this.prisma.department.findMany({
      where: { collegeId },
    });
  }

  delete(id: string) {
    return this.prisma.department.delete({
      where: { id },
    });
  }
}

