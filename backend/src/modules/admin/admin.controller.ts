import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /** Dashboard stats: colleges, companies, students counts (SUPER_ADMIN only) */
  @Get('dashboard/stats')
  @Roles(UserRole.SUPER_ADMIN)
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }
}
