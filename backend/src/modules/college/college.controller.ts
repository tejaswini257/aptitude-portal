import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

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

  @Get()
  getAll() {
    return this.service.getAllColleges();
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  create(@Body() dto: CreateCollegeDto, @Req() req) {
    return this.service.createCollege(dto, req.user.orgId);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateCollegeDto, @Req() req) {
    return this.service.update(id, dto, req.user.orgId);
  }

  @Delete(':id')
delete(@Param('id') id: string, @Req() req) {
  return this.service.delete(id, req.user.orgId);
}
}
