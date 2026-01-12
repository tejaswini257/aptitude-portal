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

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

// TEMPORARY: If DTO file exists, import it properly
import { CreateDepartmentDto } from './dto/create-department.dto';



@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN)
  @Post()
  create(@Body() dto: any) {
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
