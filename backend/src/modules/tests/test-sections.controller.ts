import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import { JwtGuard } from "../../common/guards/jwt.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";
import { TestSectionsService } from "./test-sections.service";

@Controller("test-sections")
@UseGuards(JwtGuard, RolesGuard)
export class TestSectionsController {
  constructor(private readonly service: TestSectionsService) {}

  @Roles(UserRole.COLLEGE_ADMIN, UserRole.SUPER_ADMIN)
  @Post()
  attach(
    @Body("testId") testId: string,
    @Body("sectionId") sectionId: string,
    @Body("timeLimit") timeLimit: number
  ) {
    return this.service.attachSection(testId, sectionId, timeLimit);
  }

  @Roles(UserRole.COLLEGE_ADMIN, UserRole.SUPER_ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.removeSection(id);
  }
}