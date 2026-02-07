import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('companies')
@UseGuards(JwtGuard, RolesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  /** List all companies (SUPER_ADMIN only) */
  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  findAll() {
    return this.companiesService.findAll();
  }

  /** Dashboard stats: COMPANY_ADMIN (uses JWT orgId) or SUPER_ADMIN (optional ?organizationId=) */
  @Get('dashboard/stats')
  @Roles(UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN)
  getDashboardStats(
    @Req() req: { user?: { orgId: string; role: string } },
    @Query('organizationId') organizationId?: string,
  ) {
    const orgId =
      organizationId ||
      (req.user?.role === 'COMPANY_ADMIN' ? req.user?.orgId : null);
    return this.companiesService.getDashboardStats(orgId);
  }

  /** Get one company */
  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN)
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  /** Create company + admin user (SUPER_ADMIN only) */
  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  create(@Body() dto: CreateCompanyDto) {
    return this.companiesService.create(dto);
  }

  /** Delete company (SUPER_ADMIN only) */
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
