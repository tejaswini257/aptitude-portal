import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Param,
} from "@nestjs/common";
import { SectionsService } from "./sections.service";
import { JwtGuard } from "../../common/guards/jwt.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@Controller("sections")
@UseGuards(JwtGuard, RolesGuard)
export class SectionsController {
  constructor(private readonly service: SectionsService) {}

  @Roles(UserRole.COLLEGE_ADMIN, UserRole.SUPER_ADMIN)
  @Post()
  create(@Body("sectionName") sectionName: string, @Req() req: any) {
    const orgId = req.user.orgId;
    return this.service.create(sectionName, orgId);
  }

  @Roles(UserRole.COLLEGE_ADMIN, UserRole.SUPER_ADMIN)
  @Get()
  findAll(@Req() req: any) {
    const orgId = req.user.orgId;
    return this.service.findAll(orgId);
  }

  @Get("test/:testId")
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.SUPER_ADMIN)
  findByTest(
    @Param("testId") testId: string,
    @Req() req: any,
  ) {
    const orgId = req.user?.orgId;
    if (!orgId) return [];
    return this.service.findByTest(testId, orgId);
  }
}