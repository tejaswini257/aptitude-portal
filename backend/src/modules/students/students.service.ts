import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';

type StudentProfileRow = {
  student_id: string;
  full_name: string | null;
  phone: string | null;
  education: unknown;
  skills: unknown;
  updated_at: Date;
};

@Injectable()
export class StudentsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.ensureStudentProfileTable();
  }

  private async ensureStudentProfileTable() {
    await this.prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS student_profiles (
        student_id TEXT PRIMARY KEY REFERENCES "Student"(id) ON DELETE CASCADE,
        full_name TEXT,
        phone TEXT,
        education JSONB,
        skills JSONB,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  }

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
      throw new BadRequestException('Invalid departmentId for this college');
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

  findAll(departmentId?: string, collegeId?: string) {
    const where: Prisma.StudentWhereInput = {};
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

  async update(id: string, dto: UpdateStudentDto) {
    const existing = await this.prisma.student.findUnique({ where: { id } });
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

    return { message: 'Student deleted successfully' };
  }

  async findByUserId(userId: string) {
    return this.prisma.student.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, email: true, createdAt: true } },
        college: true,
        department: true,
      },
    });
  }

  async getMyProfile(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, email: true, createdAt: true } },
        college: { select: { id: true, collegeName: true } },
        department: { select: { id: true, name: true } },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const rows = await this.prisma.$queryRawUnsafe<StudentProfileRow[]>(
      `
        SELECT student_id, full_name, phone, education, skills, updated_at
        FROM student_profiles
        WHERE student_id = $1
        LIMIT 1
      `,
      student.id,
    );

    const profile = rows[0];
    return {
      studentId: student.id,
      email: student.user.email,
      rollNo: student.rollNo,
      year: student.year,
      college: student.college,
      department: student.department,
      fullName: profile?.full_name ?? '',
      phone: profile?.phone ?? '',
      education: (profile?.education as Record<string, unknown> | null) ?? {},
      skills: (profile?.skills as string[] | null) ?? [],
      updatedAt: profile?.updated_at?.toISOString() ?? null,
    };
  }

  async updateMyProfile(userId: string, dto: UpdateStudentProfileDto) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const payload = JSON.stringify(dto.education ?? {});
    const skills = JSON.stringify(dto.skills ?? []);

    await this.prisma.$executeRawUnsafe(
      `
        INSERT INTO student_profiles (
          student_id, full_name, phone, education, skills, updated_at
        )
        VALUES ($1, $2, $3, $4::jsonb, $5::jsonb, NOW())
        ON CONFLICT (student_id)
        DO UPDATE
        SET full_name = EXCLUDED.full_name,
            phone = EXCLUDED.phone,
            education = EXCLUDED.education,
            skills = EXCLUDED.skills,
            updated_at = NOW()
      `,
      student.id,
      dto.fullName ?? null,
      dto.phone ?? null,
      payload,
      skills,
    );

    return this.getMyProfile(userId);
  }

  async getStudentAnalytics(userId: string) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException('Student not found');

    const submissions = await this.prisma.submission.findMany({
      where: { studentId: student.id },
      orderBy: { submittedAt: 'asc' },
      include: {
        test: { select: { id: true, name: true } },
      },
    });

    const total = submissions.length;
    const sum = submissions.reduce((acc, item) => acc + (item.score || 0), 0);
    const averageScore = total ? Math.round(sum / total) : 0;

    return {
      testsAttempted: total,
      averageScore,
      submissions: submissions.map((submission) => ({
        id: submission.id,
        testId: submission.testId,
        testName: submission.test?.name ?? 'Unknown',
        score: submission.score ?? 0,
        submittedAt: submission.submittedAt,
      })),
    };
  }

  async getStudentHistory(userId: string) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException('Student not found');

    const submissions = await this.prisma.submission.findMany({
      where: { studentId: student.id },
      orderBy: { submittedAt: 'desc' },
      include: {
        test: { select: { id: true, name: true, showResultImmediately: true } },
      },
    });

    return submissions.map((submission) => ({
      submissionId: submission.id,
      testId: submission.testId,
      testName: submission.test?.name ?? 'Unknown',
      score: submission.score ?? 0,
      submittedAt: submission.submittedAt,
      status: 'SUBMITTED',
      showResultImmediately: submission.test?.showResultImmediately ?? false,
    }));
  }
}
