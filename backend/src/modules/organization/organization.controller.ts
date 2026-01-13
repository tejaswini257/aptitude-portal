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
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('organizations')
@UseGuards(JwtGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  findAll() {
    return this.organizationService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.organizationService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateOrganizationDto) {
    return this.organizationService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.organizationService.delete(id);
  }
}
