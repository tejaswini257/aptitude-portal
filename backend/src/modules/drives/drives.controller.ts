import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DrivesService } from './drives.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { InviteCollegesDto } from './dto/invite-colleges.dto';

@Controller('company/drives')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.COMPANY_ADMIN)
export class DrivesController {
  constructor(private readonly drivesService: DrivesService) {}

  // -----------------------------
  // INVITE COLLEGES
  // -----------------------------
  @Post(':driveId/colleges')
  inviteColleges(
    @Param('driveId') driveId: string,
    @Body() dto: InviteCollegesDto,
    @Req() req,
  ) {
    return this.drivesService.inviteColleges(
      driveId,
      dto.collegeIds,
      req.user.orgId,
    );
  }

  // -----------------------------
  // GET INVITED COLLEGES
  // -----------------------------
  @Get(':driveId/colleges')
  getInvitedColleges(
    @Param('driveId') driveId: string,
    @Req() req,
  ) {
    return this.drivesService.getInvitedColleges(
      driveId,
      req.user.orgId,
    );
  }

  // -----------------------------
  // REMOVE COLLEGE FROM DRIVE
  // -----------------------------
  @Delete(':driveId/colleges/:collegeId')
  removeCollege(
    @Param('driveId') driveId: string,
    @Param('collegeId') collegeId: string,
    @Req() req,
  ) {
    return this.drivesService.removeCollege(
      driveId,
      collegeId,
      req.user.orgId,
    );
  }
}
