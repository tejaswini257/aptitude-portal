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
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('departments')
export class DepartmentController {
  constructor(private readonly service: DepartmentService) {}

  // ✅ CREATE (Admin)
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.COLLEGE_ADMIN)
  @Post()
  create(@Body() dto: CreateDepartmentDto) {
    return this.service.create(dto);
  }

<<<<<<< HEAD
  // ✅ GET BY COLLEGE
=======
  // ✅ GET DEPARTMENTS BY COLLEGE (Any authenticated user)
>>>>>>> aecd9d61e12bea2f7b9791e63ba64e25c2ef1e03
  @Get()
  findByCollege(@Query('collegeId') collegeId: string) {
    return this.service.findByCollege(collegeId);
  }

<<<<<<< HEAD
  // ✅ GET SINGLE (EDIT)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ✅ UPDATE (Admin)
  @UseGuards(RolesGuard)
=======
  // ✅ UPDATE DEPARTMENT (SUPER_ADMIN + COLLEGE_ADMIN)
>>>>>>> aecd9d61e12bea2f7b9791e63ba64e25c2ef1e03
  @Roles(UserRole.SUPER_ADMIN, UserRole.COLLEGE_ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDepartmentDto) {
    return this.service.update(id, dto);
  }

<<<<<<< HEAD
  // ✅ DELETE (Admin)
  @UseGuards(RolesGuard)
=======
  // ✅ DELETE DEPARTMENT (SUPER_ADMIN + COLLEGE_ADMIN)
>>>>>>> aecd9d61e12bea2f7b9791e63ba64e25c2ef1e03
  @Roles(UserRole.SUPER_ADMIN, UserRole.COLLEGE_ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  // ✅ GET DEPARTMENT BY ID
@Get(':id')
findOne(@Param('id') id: string) {
return this.departmentService.findOne(id);
}
}
