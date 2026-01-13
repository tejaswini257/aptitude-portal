import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('organizations')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN) // applies to all routes
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  // ✅ GET all organizations
  @Get()
  findAll() {
    return this.organizationService.findAll();
  }

  // ✅ CREATE organization
  @Post()
  create(@Body() dto: CreateOrganizationDto) {
    return this.organizationService.create(dto);
  }
}
