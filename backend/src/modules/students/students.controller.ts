import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // ✅ Create Student
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN)
  @Post()
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  // ✅ Get All Students
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  // ✅ Get Student by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  // ✅ Update Student
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<CreateStudentDto>) {
    return this.studentsService.update(id, body);
  }

  // ✅ Delete Student
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.delete(id);
  }
}