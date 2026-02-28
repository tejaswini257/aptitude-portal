import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Req,
  Param,
  UseGuards,
  Delete,
  Query,
} from "@nestjs/common";
import { SectionsService } from "./sections.service";
import { JwtGuard } from "../../common/guards/jwt.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";
import { CreateSectionDto } from "./dto/create-section.dto";

@Controller("sections")
@UseGuards(JwtGuard, RolesGuard)
export class SectionsController {
  constructor(private readonly service: SectionsService) { }

  // ✅ Create Section
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.SUPER_ADMIN)
  @Post()
  create(@Body() createSectionDto: CreateSectionDto, @Req() req: any) {
    const orgId = req.user.orgId;
    return this.service.create(createSectionDto, orgId);
  }

  // ✅ Get All Sections
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.SUPER_ADMIN)
  @Get()
  findAll(
    @Req() req: any,
    @Query("isQuestionBank") isQuestionBank?: string
  ) {
    const orgId = req.user.orgId;
    const isQb = isQuestionBank === "true" ? true : isQuestionBank === "false" ? false : undefined;
    return this.service.findAll(orgId, isQb);
  }

  // ✅ Get Sections Attached to Test (must be before :id)
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.SUPER_ADMIN)
  @Get("test/:testId")
  findByTest(@Param("testId") testId: string, @Req() req: any) {
    const orgId = req.user?.orgId;
    if (!orgId) return [];
    return this.service.findByTest(testId, orgId);
  }

  // ✅ Get Single Section (for Question Builder page)
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.SUPER_ADMIN)
  @Get(":id")
  findOne(@Param("id") id: string, @Req() req: any) {
    const orgId = req.user?.orgId;
    return this.service.findOne(id, orgId);
  }

  // ✅ Update Section (title, description)
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.SUPER_ADMIN)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() body: { sectionName?: string; description?: string },
    @Req() req: any,
  ) {
    const orgId = req.user?.orgId;
    return this.service.update(id, orgId, body);
  }

  // ✅ Delete Section
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.SUPER_ADMIN)
  @Delete(":id")
  delete(@Param("id") id: string, @Req() req: any) {
    const orgId = req.user?.orgId;
    return this.service.delete(id, orgId);
  }
}
