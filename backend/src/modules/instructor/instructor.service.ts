import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InstructorService {
  constructor(private readonly prisma: PrismaService) { }

  async getProfile(userId: string) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId },
      include: {
        department: true,
        user: { select: { email: true } },
      },
    });

    if (!instructor) {
      throw new NotFoundException('Instructor profile not found');
    }

    return {
      id: instructor.id,
      name: instructor.designation
        ? `${instructor.designation} (${instructor.user.email})`
        : instructor.user.email,
      email: instructor.user.email,
      department: {
        id: instructor.department.id,
        name: instructor.department.name,
      },
    };
  }

  async getDashboardStats(userId: string) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId },
      select: { departmentId: true, id: true },
    });

    if (!instructor) return null;

    const studentsCount = await this.prisma.student.count({
      where: { departmentId: instructor.departmentId },
    });

    // Mocking testsCreated and testsActive for now since Test model
    // requires more complex domain logic to tie to instructor
    return {
      studentsCount,
      testsCreated: 0,
      testsActive: 0,
    };
  }

  async getStudents(userId: string) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId },
    });
    if (!instructor) return [];

    return this.prisma.student.findMany({
      where: { departmentId: instructor.departmentId },
      include: { user: { select: { email: true } } },
    });
  }

  async getTests(userId: string) {
    // Return empty array for now based on contract scope
    return [];
  }

  // === COLLEGE ADMIN ENDPOINTS ===

  async createInstructor(dto: any, reqUser: any) {
    // Validate department
    const department = await this.prisma.department.findUnique({
      where: { id: dto.departmentId, collegeId: reqUser.collegeId }
    });
    if (!department) {
      throw new NotFoundException('Department not found in your college');
    }

    const bcrypt = require('bcrypt');
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password || 'password123', 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: 'INSTRUCTOR',
        orgId: reqUser.orgId,
      }
    });

    const instructor = await this.prisma.instructor.create({
      data: {
        userId: user.id,
        departmentId: department.id,
        designation: dto.designation || null,
      }
    });

    return instructor;
  }

  async findAllByCollege(reqUser: any) {
    if (!reqUser.collegeId) return [];

    return this.prisma.instructor.findMany({
      where: {
        department: { collegeId: reqUser.collegeId }
      },
      include: {
        user: { select: { email: true, createdAt: true } },
        department: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateInstructor(id: string, dto: any) {
    const instructor = await this.prisma.instructor.findUnique({ where: { id }, include: { user: true } });
    if (!instructor) throw new NotFoundException('Instructor not found');

    if (dto.departmentId) {
      // Basic check
      const dept = await this.prisma.department.findUnique({ where: { id: dto.departmentId } });
      if (!dept) throw new NotFoundException('Target department not found');
    }

    if (dto.email && dto.email !== instructor.user.email) {
      const emailCheck = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (emailCheck) throw new Error('Email already in use');
      await this.prisma.user.update({
        where: { id: instructor.userId },
        data: { email: dto.email }
      });
    }

    if (dto.password) {
      const bcrypt = require('bcrypt');
      const hp = await bcrypt.hash(dto.password, 10);
      await this.prisma.user.update({
        where: { id: instructor.userId },
        data: { password: hp }
      });
    }

    return this.prisma.instructor.update({
      where: { id },
      data: {
        departmentId: dto.departmentId || undefined,
        designation: dto.designation !== undefined ? dto.designation : undefined,
      }
    });
  }

  async deleteInstructor(id: string) {
    const instructor = await this.prisma.instructor.findUnique({ where: { id } });
    if (!instructor) throw new NotFoundException('Instructor not found');

    await this.prisma.instructor.delete({ where: { id } });
    await this.prisma.user.delete({ where: { id: instructor.userId } });

    return { success: true };
  }
}
