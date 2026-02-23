import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('students')
@UseGuards(JwtGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // ✅ CREATE STUDENT (Admin only)
  @Roles(UserRole.SUPER_ADMIN, UserRole.COLLEGE_ADMIN)
  @Post()
  create(@Body() dto: CreateStudentDto, @Req() req: Request) {
    const orgId = (req as any).user?.orgId as string;

    return this.studentsService.create(dto, orgId);
  }

  // ✅ GET STUDENTS (optional: departmentId or collegeId)
  @Get()
  findAll(
    @Query('departmentId') departmentId?: string,
    @Query('collegeId') collegeId?: string,
  ) {
    return this.studentsService.findAll(departmentId, collegeId);
  }

  // =============================
  // ✅ STUDENT SELF ROUTES (must be before :id to avoid 'me' being captured)
  // =============================

  @Roles(UserRole.STUDENT)
  @Get('me')
  getMe(@Req() req: any) {
    const userId = req.user?.userId ?? req.user?.id;
    return this.studentsService.findByUserId(userId);
  }

  @Roles(UserRole.STUDENT)
  @Get('me/dashboard')
  getMyDashboard(@Req() req: any) {
    const userId = req.user?.userId ?? req.user?.id;
    return this.studentsService.getStudentAnalytics(userId);
  }

  @Roles(UserRole.STUDENT)
  @Get('me/analytics')
  getMyAnalytics(@Req() req: any) {
    const userId = req.user?.userId ?? req.user?.id;
    return this.studentsService.getStudentAnalytics(userId);
  }

  // ✅ GET SINGLE STUDENT
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  // ✅ UPDATE STUDENT (Admin only)
  @Roles(UserRole.SUPER_ADMIN, UserRole.COLLEGE_ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(id, dto);
  }

  // ✅ DELETE STUDENT (Admin only)
  @Roles(UserRole.SUPER_ADMIN, UserRole.COLLEGE_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.delete(id);
  }

}
