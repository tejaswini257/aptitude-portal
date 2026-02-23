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
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('tests')
@UseGuards(JwtGuard)
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  // ✅ CREATE
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.COMPANY_ADMIN)
  create(@Body() dto: CreateTestDto, @Req() req: any) {
    return this.testsService.create(
      dto,
      req.user.userId,
      req.user.orgId,
    );
  }

  // ✅ GET ALL
  @Get()
  findAll() {
    return this.testsService.findAll();
  }

  // ✅ GET SUBMISSIONS FOR TEST
  @Get(':id/submissions')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.COMPANY_ADMIN)
  getTestSubmissions(@Param('id') id: string, @Req() req: any) {
    return this.testsService.getSubmissionsForTest(
      id,
      req.user.orgId,
    );
  }

  // ✅ GET ONE
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
   return this.testsService.findOne(id);
  }

  // ✅ UPDATE
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.COMPANY_ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateTestDto) {
    return this.testsService.update(id, dto);
  }

  // ✅ DELETE
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.COMPANY_ADMIN)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.testsService.remove(id);
  }

  // ✅ STUDENT: GET QUESTIONS
  @Get(':id/questions')
  getTestQuestions(@Param('id') id: string) {
    return this.testsService.getQuestionsForTest(id);
  }

  // ✅ ADMIN: GET QUESTIONS
  @Get(':id/questions/admin')
  getQuestionsForAdmin(@Param('id') id: string) {
    return this.testsService.getQuestionsForTest(id);
  }

  // ✅ TOGGLE PUBLISH
  @Patch(':id/toggle-publish')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.COLLEGE_ADMIN, UserRole.COMPANY_ADMIN)
  togglePublish(@Param('id') id: string, @Req() req: any) {
    return this.testsService.togglePublish(id, req.user.orgId);
  }

  // ✅ TOGGLE ACTIVE
  @Patch(':id/toggle-active')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.COLLEGE_ADMIN, UserRole.COMPANY_ADMIN)
  toggleActive(@Param('id') id: string, @Req() req: any) {
    return this.testsService.toggleActive(id, req.user.orgId);
  }
}
