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
import { CreateQuestionDto } from './dto/create-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

type AuthenticatedRequest = {
  user: {
    orgId?: string;
    id?: string;
    role?: string;
  };
};

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private readonly service: QuestionsService) { }

  // CREATE
  @Post()
  create(@Body() dto: any, @Req() req: AuthenticatedRequest) {
    return this.service.create(dto, req.user);
  }

  // GET QUESTIONS BY TEST
  @Get('test/:testId')
  findByTest(@Param('testId') testId: string, @Req() req: AuthenticatedRequest) {
    return this.service.findByTest(testId, req.user.orgId!);
  }

  // UPDATE
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateQuestionDto>,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.update(id, dto, req.user);
  }

  // DELETE
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.service.deleteQuestion(id, req.user.orgId!);
  }

  // REORDER
  @Patch(':id/reorder')
  reorder(
    @Param('id') id: string,
    @Body('direction') direction: 'UP' | 'DOWN',
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.reorderQuestion(id, direction, req.user.orgId!);
  }

  @Get()
  findAll(
    @Query('sectionId') sectionId: string,
    @Query('type') type: string,
    @Query('difficulty') difficulty: string,
    @Query('search') search: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.findAllForBuilder(
      req.user.orgId!,
      sectionId,
      type,
      difficulty,
      search,
    );
  }

  @Get('bank')
  getQuestionBank(
    @Query('sectionId') sectionId: string,
    @Query('type') type: string,
    @Query('difficulty') difficulty: string,
    @Query('search') search: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.getQuestionBank(
      sectionId,
      type,
      difficulty,
      search,
      req.user.orgId!,
    );
  }
}
