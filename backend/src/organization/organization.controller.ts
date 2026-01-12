import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  create(@Body() body: CreateOrganizationDto) {   // ✅ typed DTO
    return this.organizationService.create(body);
  }

  @Get()
  findAll() {
    return this.organizationService.findAll();
  }
}



