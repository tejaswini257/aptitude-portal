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
@UseGuards(JwtAuthGuard)
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  // ✅ CREATE
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.COMPANY_ADMIN)
  create(@Body() dto: CreateTestDto, @Req() req: any) {
    return this.testsService.create(dto, req.user.orgId);
  }

  // ✅ GET ALL
  @Get()
  findAll(@Req() req: any) {
    return this.testsService.findAll(req.user.orgId);
  }

  // ✅ GET ONE
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.testsService.findOne(id, req.user.orgId);
  }

  // ✅ UPDATE
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.COMPANY_ADMIN)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTestDto,
    @Req() req: any,
  ) {
    return this.testsService.update(id, dto, req.user.orgId);
  }

  // ✅ DELETE
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.COMPANY_ADMIN)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.testsService.remove(id, req.user.orgId);
  }
}
