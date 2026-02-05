import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DrivesService } from './drives.service';
import { CreateDriveDto } from './dto/create-drive.dto';
import { UpdateDriveDto } from './dto/update-drive.dto';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('company/drives')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.COMPANY_ADMIN)
export class DrivesController {
  constructor(private readonly drivesService: DrivesService) {}

  // ✅ CREATE DRIVE
  @Post()
  create(@Body() dto: CreateDriveDto, @Req() req) {
    return this.drivesService.create(dto, req.user.orgId);
  }

  // ✅ LIST DRIVES
  @Get()
  findAll(@Req() req) {
    return this.drivesService.findAll(req.user.orgId);
  }

  // ✅ GET SINGLE DRIVE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.drivesService.findOne(id);
  }

  // ✅ UPDATE DRIVE
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDriveDto) {
    return this.drivesService.update(id, dto);
  }

  // ✅ CLOSE DRIVE
  @Patch(':id/close')
  close(@Param('id') id: string) {
    return this.drivesService.close(id);
  }
}
