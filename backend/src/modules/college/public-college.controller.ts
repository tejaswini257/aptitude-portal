import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('public-colleges')
export class PublicCollegeController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async getColleges() {
        return this.prisma.college.findMany({
            where: { isApproved: true },
            select: {
                id: true,
                collegeName: true,
            },
            orderBy: { collegeName: 'asc' },
        });
    }

    @Get(':collegeId/departments')
    async getDepartments(@Param('collegeId') collegeId: string) {
        return this.prisma.department.findMany({
            where: { collegeId },
            select: {
                id: true,
                name: true,
            },
            orderBy: { name: 'asc' },
        });
    }
}
