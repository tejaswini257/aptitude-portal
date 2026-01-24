import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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

  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  create(@Body() dto: CreateCollegeDto) {
    return this.service.create(dto);
  }

  // ✅ THIS WAS MISSING
  @Get()
  findAll(@Req() req: any) {
    return this.service.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCollegeDto) {
    return this.service.update(id, dto);
  }
}
