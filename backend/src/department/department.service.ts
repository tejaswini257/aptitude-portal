import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateDepartmentDto) {
    return this.prisma.department.create({
      data: {
        name: dto.name,
        collegeId: dto.collegeId,
      },
    });
  }

  findByCollege(collegeId: string) {
    return this.prisma.department.findMany({
      where: { collegeId },
    });
  }

  update(id: string, name: string) {
    return this.prisma.department.update({
      where: { id },
      data: { name },
    });
  }

  delete(id: string) {
    return this.prisma.department.delete({
      where: { id },
    });
  }
}
