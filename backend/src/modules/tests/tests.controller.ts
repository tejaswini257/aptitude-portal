import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Param,
  Get,
  Delete,
  Patch,
} from '@nestjs/common';
import { TestService } from './tests.service';
import { CreateTestDto } from './dto/create-test.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tests')
@UseGuards(JwtAuthGuard)
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  async createTest(
    @Body() dto: CreateTestDto,
    @Req() req: any,
  ) {
    return this.testService.createTest(dto, req.user);
  }

  @Get()
async findAll(@Req() req: any) {
  return this.testService.findAll(req.user);
}

  @Post(':id/questions')
async addQuestion(
  @Param('id') testId: string,
  @Body() body: { questionId: string; sectionId: string },
  @Req() req: any,
) {
  return this.testService.addQuestionToTest(
    testId,
    body.questionId,
    body.sectionId,
    req.user,
  );
}

@Get(':id/builder')
async getBuilder(
  @Param('id') testId: string,
  @Req() req: any,
) {
  return this.testService.getBuilder(testId, req.user);
}

@Delete(':testId/questions/:testQuestionId')
async removeQuestion(
  @Param('testId') testId: string,
  @Param('testQuestionId') testQuestionId: string,
  @Req() req: any,
) {
  return this.testService.removeQuestion(
    testId,
    testQuestionId,
    req.user,
  );
}

@Patch('questions/:testQuestionId/reorder')
async reorderQuestion(
  @Param('testQuestionId') testQuestionId: string,
  @Body() body: { newOrder: number },
  @Req() req: any,
) {
  return this.testService.reorderQuestion(
    testQuestionId,
    body.newOrder,
    req.user,
  );
}

@Patch(':id/publish')
async togglePublish(
  @Param('id') testId: string,
  @Body() body: { isPublished: boolean },
  @Req() req: any,
) {
  return this.testService.togglePublish(
    testId,
    body.isPublished,
    req.user,
  );
}

@Patch(':id/active')
async toggleActive(
  @Param('id') testId: string,
  @Body() body: { isActive: boolean },
  @Req() req: any,
) {
  return this.testService.toggleActive(
    testId,
    body.isActive,
    req.user,
  );
}

@Get(':id/preview')
async previewTest(
  @Param('id') testId: string,
  @Req() req: any,
) {
  return this.testService.previewTest(
    testId,
    req.user,
  );
}
}