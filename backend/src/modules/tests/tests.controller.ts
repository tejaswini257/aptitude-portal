import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { TestsService } from './tests.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('tests')
@UseGuards(JwtAuthGuard)
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  // ✅ CREATE TEST (COLLEGE_ADMIN / COMPANY_ADMIN)
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.COMPANY_ADMIN)
  @Post()
  create(@Body() dto: CreateTestDto, @Req() req) {
    return this.testsService.create(
      dto,
      req.user.userId,
      req.user.orgId,
    );
  }

  // ✅ GET ALL TESTS (OPTIONAL org filter)
  @Get()
  findAll(@Query('orgId') orgId?: string) {
    return this.testsService.findAll(orgId);
  }

  // ✅ GET SINGLE TEST
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testsService.findOne(id);
  }

  // ✅ UPDATE TEST
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.COMPANY_ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTestDto) {
    return this.testsService.update(id, dto);
  }

  // ✅ DELETE TEST
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.COMPANY_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testsService.delete(id);
  }
}
