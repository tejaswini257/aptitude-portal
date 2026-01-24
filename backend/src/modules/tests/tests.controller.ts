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

  // ✅ CREATE TEST — ONLY COLLEGE_ADMIN
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN)
  create(@Body() dto: CreateTestDto, @Req() req) {
    return this.testsService.create(dto, req.user.userId);
  }

  // ✅ GET ALL TESTS — ANY LOGGED-IN USER
  @Get()
  findAll() {
    return this.testsService.findAll();
  }

  // ✅ GET SINGLE TEST — ANY LOGGED-IN USER
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testsService.findOne(id);
  }

  // ✅ UPDATE TEST — ONLY COLLEGE_ADMIN
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateTestDto) {
    return this.testsService.update(id, dto);
  }

  // ✅ DELETE TEST — ONLY COLLEGE_ADMIN
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN)
  remove(@Param('id') id: string) {
    return this.testsService.remove(id);
  }
}
