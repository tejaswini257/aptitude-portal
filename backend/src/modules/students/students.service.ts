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

  // ✅ CREATE STUDENT (User + Student)
  async create(dto: CreateStudentDto) {
    // Check duplicate email
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create User
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: UserRole.STUDENT,
        orgId: dto.orgId,
      },
    });

    // Create Student
    return this.prisma.student.create({
      data: {
        rollNo: dto.rollNo,
        year: dto.year,
        userId: user.id,
        collegeId: dto.collegeId,
        departmentId: dto.departmentId,
      },
      include: {
        user: true,
        college: true,
        department: true,
      },
    });
  }

  // ✅ GET STUDENTS (with optional department filter)
  findAll(departmentId?: string) {
    return this.prisma.student.findMany({
      where: departmentId ? { departmentId } : {},
      include: {
        user: true,
        college: true,
        department: true,
      },
    });
  }

  // ✅ GET ONE STUDENT
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

  // ✅ UPDATE STUDENT
  update(id: string, dto: UpdateStudentDto) {
    return this.prisma.student.update({
      where: { id },
      data: dto,
    });
  }

  // ✅ DELETE STUDENT
  delete(id: string) {
    return this.prisma.student.delete({
      where: { id },
    });
  }
}
