import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('instructor')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.INSTRUCTOR)
export class InstructorController {
    constructor(private readonly instructorService: InstructorService) { }

    @Get('me')
    getProfile(@Request() req: any) {
        return this.instructorService.getProfile(req.user.id);
    }

    @Get('dashboard')
    getDashboardStats(@Request() req: any) {
        return this.instructorService.getDashboardStats(req.user.id);
    }

    @Get('students')
    getStudents(@Request() req: any) {
        return this.instructorService.getStudents(req.user.id);
    }

    @Get('tests')
    getTests(@Request() req: any) {
        return this.instructorService.getTests(req.user.id);
    }
}
