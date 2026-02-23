import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DifficultyLevel } from '@prisma/client';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

type AuthenticatedRequest = {
  user: {
    orgId?: string;
  };
};

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private readonly service: QuestionsService) {}

  @Post()
  create(@Body() dto: unknown, @Req() req: AuthenticatedRequest) {
    return this.service.create(dto, req.user.orgId || '');
  }

  @Get('test/:testId')
  findByTest(@Param('testId') testId: string) {
    return this.service.findByTest(testId);
  }

  @Get('practice/sections')
  getPracticeSections() {
    return this.service.getPracticeSections();
  }

  @Get('practice')
  getPracticeQuestions(
    @Query('topic') topic?: string,
    @Query('difficulty') difficulty?: DifficultyLevel,
    @Query('limit') limit?: string,
  ) {
    const parsedLimit = limit ? Number(limit) : undefined;
    return this.service.getPracticeQuestions(topic, difficulty, parsedLimit);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: unknown) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
