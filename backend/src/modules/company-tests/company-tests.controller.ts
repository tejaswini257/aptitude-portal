import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import {
  CompanyTestsService,
  CreateCompanyTestDto,
} from './company-tests.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { SubsciptionGuard } from '../../common/guards/subsciption.guard';
import { Roles } from '../../common/decorators/roles.decorator';

type AuthenticatedRequest = {
  user: {
    orgId: string;
  };
};

@Controller('company/tests')
@UseGuards(JwtGuard, RolesGuard, SubsciptionGuard)
@Roles(UserRole.COMPANY_ADMIN)
export class CompanyTestsController {
  constructor(private readonly service: CompanyTestsService) {}

  @Post()
  create(@Body() dto: CreateCompanyTestDto, @Req() req: AuthenticatedRequest) {
    return this.service.create(dto, req.user.orgId);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.service.findAll(req.user.orgId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.service.findOne(id, req.user.orgId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateCompanyTestDto>,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.update(id, dto, req.user.orgId);
  }

  @Patch(':id/archive')
  archive(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.service.archive(id, req.user.orgId);
  }
}
