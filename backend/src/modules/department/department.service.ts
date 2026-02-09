import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDepartmentDto) {
    const college = await this.prisma.college.findUnique({
      where: { id: dto.collegeId },
    });

    if (!college) {
      throw new NotFoundException('College not found');
    }

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

  // ✅ REQUIRED FOR EDIT FLOW
  async findOne(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }

  async update(id: string, dto: UpdateDepartmentDto) {
    return this.prisma.department.update({
      where: { id },
      data: { name: dto.name },
    });
  }

  async findById(id: string) {
return this.prisma.department.findUnique({
where: { id },
});
}

  async delete(id: string) {
    return this.prisma.department.delete({
      where: { id },
    });
  }
}
