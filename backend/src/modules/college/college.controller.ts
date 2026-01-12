import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
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
  constructor(private collegesService: CollegesService) {}

  @Get()
  getAll() {
    return this.collegesService.getAllColleges();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.collegesService.getCollegeById(id);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  createCollege(@Body() dto: CreateCollegeDto) {
    return this.collegesService.createCollege(dto, 'orgId');
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN)
  update(@Param('id') id: string, 
  @Body() dto: UpdateCollegeDto,
  ) {
    return this.collegesService.updateCollege(id, dto);
  }

   @Roles(UserRole.SUPER_ADMIN)
@Delete(':id')
deleteCollege(@Param('id') id: string) {
  return this.collegesService.deleteCollege(id);
}
}
