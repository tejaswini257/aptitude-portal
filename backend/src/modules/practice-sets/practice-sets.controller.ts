import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PracticeSetsService } from './practice-sets.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('practice-sets')
@UseGuards(JwtGuard)
export class PracticeSetsController {
  constructor(private readonly service: PracticeSetsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.SUPER_ADMIN)
  create(@Body() dto: any, @Req() req: any) {
    const orgId = req.user?.orgId;
    if (!orgId) throw new Error('Organization required');
    return this.service.create(orgId, dto);
  }

  @Get()
  findAll(@Req() req: any) {
    const orgId = req.user?.orgId;
    if (!orgId) return [];
    return this.service.findAll(orgId);
  }

  @Get('student')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  findForStudent(@Req() req: any) {
    const orgId = req.user?.orgId;
    if (!orgId) return [];
    return this.service.findForStudent(orgId);
  }

  @Get(':id/questions')
  getQuestions(@Param('id') id: string, @Req() req: any) {
    const orgId = req.user?.orgId;
    return this.service.getQuestions(id, orgId);
  }
}
