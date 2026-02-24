import { Injectable, NotFoundException } from '@nestjs/common';
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
            name: instructor.designation ? `${instructor.designation} (${instructor.user.email})` : instructor.user.email,
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
}
