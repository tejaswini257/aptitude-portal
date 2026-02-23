import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

type AuthenticatedRequest = {
  user: {
    userId: string;
    orgId: string;
  };
};

@Controller('students')
@UseGuards(JwtGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Roles(UserRole.SUPER_ADMIN, UserRole.COLLEGE_ADMIN)
  @Post()
  create(@Body() dto: CreateStudentDto, @Req() req: AuthenticatedRequest) {
    return this.studentsService.create(dto, req.user.orgId);
  }

  @Get()
  findAll(
    @Query('departmentId') departmentId?: string,
    @Query('collegeId') collegeId?: string,
  ) {
    return this.studentsService.findAll(departmentId, collegeId);
  }

  @Roles(UserRole.STUDENT)
  @Get('me')
  getMe(@Req() req: AuthenticatedRequest) {
    return this.studentsService.findByUserId(req.user.userId);
  }

  @Roles(UserRole.STUDENT)
  @Get('me/profile')
  getMyProfile(@Req() req: AuthenticatedRequest) {
    return this.studentsService.getMyProfile(req.user.userId);
  }

  @Roles(UserRole.STUDENT)
  @Put('me/profile')
  updateMyProfile(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateStudentProfileDto,
  ) {
    return this.studentsService.updateMyProfile(req.user.userId, dto);
  }

  @Roles(UserRole.STUDENT)
  @Get('me/dashboard')
  getMyDashboard(@Req() req: AuthenticatedRequest) {
    return this.studentsService.getStudentAnalytics(req.user.userId);
  }

  @Roles(UserRole.STUDENT)
  @Get('me/analytics')
  getMyAnalytics(@Req() req: AuthenticatedRequest) {
    return this.studentsService.getStudentAnalytics(req.user.userId);
  }

  @Roles(UserRole.STUDENT)
  @Get('me/history')
  getMyHistory(@Req() req: AuthenticatedRequest) {
    return this.studentsService.getStudentHistory(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.COLLEGE_ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(id, dto);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.COLLEGE_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.delete(id);
  }
}
