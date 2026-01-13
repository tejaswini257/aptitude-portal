import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStudentDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: UserRole.STUDENT,
        orgId: null,
      },
    });

    return this.prisma.student.create({
      data: {
        rollNo: dto.rollNo,
        year: dto.year,
        collegeId: dto.collegeId,
        departmentId: dto.departmentId,
        userId: user.id,
      },
      include: {
        user: true,
      },
    });
  }

  async findAll() {
    return this.prisma.student.findMany({
      include: { user: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.student.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async update(id: string, data: Partial<CreateStudentDto>) {
    return this.prisma.student.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.student.delete({
      where: { id },
    });
  }
}