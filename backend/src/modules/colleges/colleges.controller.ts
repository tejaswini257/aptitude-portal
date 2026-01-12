import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CollegesService } from './colleges.service';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('colleges')
@UseGuards(JwtGuard, RolesGuard)
export class CollegesController {
  constructor(private readonly collegesService: CollegesService) {}

  @Get()
  getAllColleges() {
    return this.collegesService.getAll();
  }

  @Get(':id')
  getCollegeById(@Param('id') id: string) {
    return this.collegesService.getById(id);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  createCollege(@Body() dto: CreateCollegeDto) {
    return this.collegesService.create(dto);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Put(':id')
  updateCollege(
    @Param('id') id: string,
    @Body() dto: UpdateCollegeDto,
  ) {
    return this.collegesService.update(id, dto);
  }
}
