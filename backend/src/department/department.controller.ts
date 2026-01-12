import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
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
  find(@Query('collegeId') collegeId: string) {
    return this.departmentService.findByCollege(collegeId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body('name') name: string) {
    return this.departmentService.update(id, name);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.departmentService.delete(id);
  }
}
