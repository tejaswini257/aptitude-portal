import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  // ✅ CREATE
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

  // ✅ GET BY COLLEGE
  findByCollege(collegeId: string) {
    return this.prisma.department.findMany({
      where: { collegeId },
    });
  }

  // ✅ GET SINGLE (FOR EDIT)  ⭐ THIS WAS MISSING
  async findOne(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }

  // ✅ UPDATE
  async update(id: string, dto: UpdateDepartmentDto) {
    return this.prisma.department.update({
      where: { id },
      data: dto,
    });
  }

  // ✅ DELETE
  async delete(id: string) {
    return this.prisma.department.delete({
      where: { id },
    });
  }
}
