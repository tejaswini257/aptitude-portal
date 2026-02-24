import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('college/instructors')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.COLLEGE_ADMIN, UserRole.SUPER_ADMIN)
export class CollegeInstructorController {
    constructor(private readonly instructorService: InstructorService) { }

    @Post()
    create(@Body() dto: any, @Req() req: any) {
        return this.instructorService.createInstructor(dto, req.user);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.instructorService.findAllByCollege(req.user);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: any) {
        return this.instructorService.updateInstructor(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.instructorService.deleteInstructor(id);
    }
}
