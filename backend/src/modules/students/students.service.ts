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
  async create(dto: CreateStudentDto, orgId: string) {
    // Validate college
    const college = await this.prisma.college.findUnique({
      where: { id: dto.collegeId },
    });

    if (!college) {
      throw new BadRequestException('Invalid collegeId');
    }

    // Validate department and ensure it belongs to the same college
    const department = await this.prisma.department.findUnique({
      where: { id: dto.departmentId },
    });

    if (!department || department.collegeId !== college.id) {
      throw new BadRequestException('Invalid departmentId for this college');
    }

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
        orgId: orgId,
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

  // ✅ GET STUDENTS (optional filter by departmentId or collegeId)
  findAll(departmentId?: string, collegeId?: string) {
    const where: any = {};
    if (departmentId) where.departmentId = departmentId;
    else if (collegeId) where.collegeId = collegeId;
    return this.prisma.student.findMany({
      where,
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
  async update(id: string, dto: UpdateStudentDto) {
    const existing = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Student not found');
    }

    // If department is changing, validate it and keep college consistent
    let departmentId = existing.departmentId;

    if (dto.departmentId) {
      const newDept = await this.prisma.department.findUnique({
        where: { id: dto.departmentId },
      });

      if (!newDept || newDept.collegeId !== existing.collegeId) {
        throw new BadRequestException(
          'Invalid departmentId for this student college',
        );
      }

      departmentId = dto.departmentId;
    }

    return this.prisma.student.update({
      where: { id },
      data: {
        rollNo: dto.rollNo ?? existing.rollNo,
        year: dto.year ?? existing.year,
        departmentId,
      },
      include: {
        user: true,
        college: true,
        department: true,
      },
    });
  }

  // ✅ DELETE STUDENT
  async delete(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    await this.prisma.$transaction([
      this.prisma.student.delete({ where: { id } }),
      this.prisma.user.delete({ where: { id: student.userId } }),
    ]);

    return {
      message: 'Student deleted successfully',
    };
  }
}
