import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { AdminService } from './admin.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

type AuthenticatedRequest = {
  user: {
    id: string;
  };
};

type UpdateRolePermissionsDto = {
  permissions: string[];
};

@Controller('admin')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('dashboard/stats')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('analytics/overview')
  getPlatformAnalytics() {
    return this.adminService.getPlatformAnalyticsOverview();
  }

  @Get('tests')
  getAllTests() {
    return this.adminService.getAllTestsGlobally();
  }

  @Get('roles')
  getRoles() {
    return this.adminService.getRolePermissions();
  }

  @Put('roles/:role')
  updateRole(
    @Param('role') role: UserRole,
    @Body() dto: UpdateRolePermissionsDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.adminService.updateRolePermissions(
      role,
      Array.isArray(dto?.permissions) ? dto.permissions : [],
      req.user.id,
    );
  }

  @Get('subscriptions')
  getSubscriptions() {
    return this.adminService.getSubscriptions();
  }

  @Put('subscriptions/:orgId')
  updateSubscription(
    @Param('orgId') orgId: string,
    @Body('validityDays', ParseIntPipe) validityDays: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.adminService.updateSubscription(
      orgId,
      validityDays,
      req.user.id,
    );
  }

  @Get('monitoring')
  getMonitoring() {
    return this.adminService.getMonitoringOverview();
  }

  @Get('users')
  getUsers() {
    return this.adminService.getUsersWithBlockStatus();
  }

  @Put('users/:id/block')
  blockUser(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.adminService.blockUser(id, reason || 'Admin blocked', req.user.id);
  }

  @Put('users/:id/unblock')
  unblockUser(@Param('id') id: string) {
    return this.adminService.unblockUser(id);
  }
}
