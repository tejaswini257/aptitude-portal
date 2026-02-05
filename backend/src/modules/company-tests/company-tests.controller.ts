import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CompanyTestsService } from './company-tests.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('company/tests')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.COMPANY_ADMIN)
export class CompanyTestsController {
  constructor(private readonly service: CompanyTestsService) {}

  // ✅ CREATE TEST
  @Post()
  create(@Body() dto: any, @Req() req) {
    return this.service.create(dto, req.user.orgId);
  }

  // ✅ LIST COMPANY TESTS
  @Get()
  findAll(@Req() req) {
    return this.service.findAll(req.user.orgId);
  }

  // ✅ GET SINGLE TEST
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.service.findOne(id, req.user.orgId);
  }

  // ✅ UPDATE TEST
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: any,
    @Req() req,
  ) {
    return this.service.update(id, dto, req.user.orgId);
  }

  // ✅ ARCHIVE TEST
  @Patch(':id/archive')
  archive(@Param('id') id: string, @Req() req) {
    return this.service.archive(id, req.user.orgId);
  }
}
