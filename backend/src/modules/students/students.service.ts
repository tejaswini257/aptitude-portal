import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStudentDto) {
  return this.prisma.student.create({
    data: {
      rollNo: dto.rollNo,
      year: dto.year,
      userId: dto.userId,
      collegeId: dto.collegeId,
      departmentId: dto.departmentId,
    },
  });
}

  findAll() {
    return this.prisma.student.findMany({
      include: {
        user: true,
        college: true,
        department: true,
      },
    });
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        user: true,
        college: true,
        department: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  update(id: string, dto: UpdateStudentDto) {
    return this.prisma.student.update({
      where: { id },
      data: dto,
    });
  }

  delete(id: string) {
    return this.prisma.student.delete({
      where: { id },
    });
  }
}
