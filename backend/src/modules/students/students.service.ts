import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStudentDto) {
    // 🔹 Validate College
    const college = await this.prisma.college.findUnique({
      where: { id: dto.collegeId },
      select: { orgId: true },
    });

    if (!college) {
      throw new NotFoundException('College not found');
    }

    // 🔹 Validate Department
    const department = await this.prisma.department.findUnique({
      where: { id: dto.departmentId },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    // 🔹 Prevent duplicate student
    const existingStudent = await this.prisma.student.findFirst({
      where: {
        rollNo: dto.rollNo,
        collegeId: dto.collegeId,
      },
    });

    if (existingStudent) {
      throw new BadRequestException('Student already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 🔹 Create User + Student together
    return this.prisma.student.create({
      data: {
        rollNo: dto.rollNo,
        year: dto.year,
        collegeId: dto.collegeId,
        departmentId: dto.departmentId,

        user: {
          create: {
            email: dto.email,
            password: hashedPassword,
            role: UserRole.STUDENT,
            orgId: college.orgId,
          },
        },
      },
      include: {
        user: true,
        college: true,
        department: true,
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
