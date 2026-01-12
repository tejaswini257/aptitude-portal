import { Controller, Patch, Param, UseGuards } from '@nestjs/common';
import { CollegeService } from './college.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('colleges')
export class CollegeController {
  constructor(private readonly collegeService: CollegeService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@Patch(':id/approve')
approveCollege(@Param('id') id: string) {
  return this.collegeService.approveCollege(id);
}

}