import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Controller('organizations')
@UseGuards(JwtGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  // ✅ GET all organizations
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get()
  findAll() {
    return this.organizationService.findAll();
  }

  // ✅ CREATE organization
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  create(@Body() dto: CreateOrganizationDto) {
    return this.organizationService.create(dto);
  }
}







