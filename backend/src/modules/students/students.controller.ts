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
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('students')
@UseGuards(JwtGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // ✅ Create Student
  @Roles(UserRole.SUPER_ADMIN, UserRole.COLLEGE_ADMIN)
  @Post()
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  // ✅ Get All Students
  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  // ✅ Get Student by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  // ✅ Update Student
  @Roles(UserRole.SUPER_ADMIN, UserRole.COLLEGE_ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(id, dto);
  }

  // ✅ Delete Student
  @Roles(UserRole.SUPER_ADMIN, UserRole.COLLEGE_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.delete(id);
  }
}
