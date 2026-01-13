import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CollegeService } from './college.service';

import { CollegesService } from './college.service';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';

import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('colleges')
@UseGuards(JwtGuard, RolesGuard)
export class CollegesController {
  constructor(private service: CollegesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  create(@Body() dto: any) {
    return this.collegeService.create(dto);
  }
}
