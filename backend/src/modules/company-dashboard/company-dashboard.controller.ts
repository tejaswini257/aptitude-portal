import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { CompanyDashboardService } from './company-dashboard.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('company/dashboard')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.COMPANY_ADMIN)
export class CompanyDashboardController {
  constructor(private readonly service: CompanyDashboardService) {}

  @Get()
  getDashboard(@Req() req) {
    return this.service.getDashboard(req.user);
  }
}
