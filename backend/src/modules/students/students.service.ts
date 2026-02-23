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

  // ================= CREATE =================
  async create(dto: CreateStudentDto, orgId: string) {
    const college = await this.prisma.college.findUnique({
      where: { id: dto.collegeId },
    });

    if (!college) {
      throw new BadRequestException('Invalid collegeId');
    }

    const department = await this.prisma.department.findUnique({
      where: { id: dto.departmentId },
    });

    if (!department || department.collegeId !== college.id) {
      throw new BadRequestException(
        'Invalid departmentId for this college',
      );
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: UserRole.STUDENT,
        orgId,
      },
    });

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

  // ================= GET ALL =================
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

  // ================= GET ONE =================
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

  // ================= UPDATE =================
  async update(id: string, dto: UpdateStudentDto) {
    const existing = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Student not found');
    }

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

  // ================= DELETE =================
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

  // ================= FIND BY USER ID =================
  async findByUserId(userId: string) {
  return this.prisma.student.findUnique({
    where: { userId },
    include: { college: true, department: true },
  });
}

async getStudentAnalytics(userId: string) {
  const student = await this.prisma.student.findUnique({
    where: { userId },
  });

  if (!student) throw new NotFoundException('Student not found');

  const submissions = await this.prisma.submission.findMany({
    where: { studentId: student.id },
  });


  const total = submissions.length;
  const sum = submissions.reduce((s, x) => s + (x.score || 0), 0);
  const averageScore = total ? Math.round(sum / total) : 0;

  return {
    testsAttempted: total,
    averageScore,
    submissions: submissions.map((s) => ({
      id: s.id,
      testId: s.testId,
      testName: s.testId,
      score: s.score ?? 0,
      submittedAt: s.submittedAt,
    })),
  };
}

}
