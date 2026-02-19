import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { TestsService } from './tests.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('tests')
@UseGuards(JwtAuthGuard) // 🔐 JWT for all routes
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  // ✅ CREATE TEST — COLLEGE_ADMIN or COMPANY_ADMIN
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.COMPANY_ADMIN)
  create(@Body() dto: CreateTestDto, @Req() req: any) {
    const orgId =
      req.user?.role === 'COMPANY_ADMIN' ? req.user?.orgId : undefined;
    return this.testsService.create(dto);
  }

  // ✅ GET ALL TESTS — ANY LOGGED-IN USER (optional filter by organizationId for company admin)
  @Get()
  findAll(@Query('organizationId') organizationId?: string, @Req() req?: any) {
    const orgId =
      organizationId ||
      (req?.user?.role === 'COMPANY_ADMIN' ? req?.user?.orgId : undefined);
    return this.testsService.findAll(orgId);
  }

  // ✅ GET SINGLE TEST — ANY LOGGED-IN USER
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testsService.findOne(id);
  }

  // ✅ UPDATE TEST — COLLEGE_ADMIN or COMPANY_ADMIN
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.COMPANY_ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateTestDto) {
    return this.testsService.update(id, dto);
  }

  // ✅ DELETE TEST — COLLEGE_ADMIN or COMPANY_ADMIN
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.COMPANY_ADMIN)
  remove(@Param('id') id: string) {
    return this.testsService.remove(id);
  }
}
