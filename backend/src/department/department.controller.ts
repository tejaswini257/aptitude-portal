import { Controller, Post, Body, Get, Query, Delete, Param } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  create(@Body() dto: CreateDepartmentDto) {
    return this.departmentService.create(dto);
  }

  @Get()
  findByCollege(@Query('collegeId') collegeId: string) {
    return this.departmentService.findByCollege(collegeId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentService.delete(id);
  }
}

