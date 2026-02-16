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

  // ✅ CREATE — College Admin + Company Admin
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.COMPANY_ADMIN)
  create(@Body() dto: CreateTestDto, @Req() req: any) {
    const orgId = req.user.orgId;
    return this.testsService.create(dto, orgId);
  }


  // ✅ GET ALL (scoped to org). ?withAttemptCount=1 for college/company dashboard
  @Get()
  findAll(
    @Req() req: any,
    @Query('withAttemptCount') withAttemptCount?: string,
  ) {
    const orgId = req.user?.orgId;
    return this.testsService.findAll(
      orgId,
      req.user,
      withAttemptCount === '1' || withAttemptCount === 'true',
    );
  }

  // ✅ GET SUBMISSIONS FOR TEST (college/company admin) - must be before :id
  @Get(':id/submissions')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.COMPANY_ADMIN)
  getTestSubmissions(@Param('id') id: string, @Req() req: any) {
    return this.testsService.getSubmissionsForTest(id, req.user.orgId);
  }

  // ✅ GET ONE (scoped to org)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.testsService.findOne(id, req.user.orgId);
  }

  // ✅ UPDATE
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.COMPANY_ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateTestDto) {
    return this.testsService.update(id, dto);
  }

  // ✅ DELETE (scoped to org)
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.COMPANY_ADMIN)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.testsService.remove(id, req.user.orgId);
  }

  // ✅ STUDENT: GET QUESTIONS
  @Get(':id/questions')
  //@UseGuards(JwtAuthGuard, RolesGuard)
  //@Roles(UserRole.STUDENT)
  getTestQuestions(@Param('id') id: string) {
    return this.testsService.getQuestionsForTest(id);
  }

  @Get(':id/questions/admin')
  getQuestionsForAdmin(@Param('id') id: string) {
    return this.testsService.getQuestionsForTest(id);
  }



  @Patch(':id/toggle-publish')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.COLLEGE_ADMIN, UserRole.COMPANY_ADMIN)
  togglePublish(@Param('id') id: string, @Req() req: any) {
    const orgId = req.user?.orgId;
    return this.testsService.togglePublish(id, orgId);
  }

  @Patch(':id/toggle-active')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.COLLEGE_ADMIN, UserRole.COMPANY_ADMIN)
  toggleActive(@Param('id') id: string, @Req() req: any) {
    const orgId = req.user?.orgId;
    return this.testsService.toggleActive(id, orgId);
  }
}
