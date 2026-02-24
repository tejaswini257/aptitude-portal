import {
  Body,
<<<<<<< HEAD
  Controller,
=======
  Get,
  Patch,
  Param,
>>>>>>> d91389d827f612a3fc5abc416ed8d834194b8ae9
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { DifficultyLevel } from '@prisma/client';
import { QuestionsService } from './questions.service';
<<<<<<< HEAD
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

type AuthenticatedRequest = {
  user: {
    orgId?: string;
  };
};

=======
import { CreateQuestionDto } from './dto/create-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

>>>>>>> d91389d827f612a3fc5abc416ed8d834194b8ae9
@Controller('questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private readonly service: QuestionsService) {}

  // CREATE
  @Post()
<<<<<<< HEAD
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
=======
create(
  @Body() dto: any,
  @Req() req: any
) {
  return this.service.create(dto, req.user);
>>>>>>> d91389d827f612a3fc5abc416ed8d834194b8ae9
}
  // GET QUESTIONS BY TEST
  @Get('test/:testId')
  findByTest(@Param('testId') testId: string, @Req() req: any) {
    return this.service.findByTest(testId, req.user.orgId);
  }

  // UPDATE
  @Patch(':id')
update(
  @Param('id') id: string,
  @Body() dto: Partial<CreateQuestionDto>,
  @Req() req: any,
) {
  return this.service.update(id, dto, req.user);
}

  // DELETE
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: any) {
    return this.service.deleteQuestion(id, req.user.orgId);
  }

  // REORDER
  @Patch(':id/reorder')
  reorder(
    @Param('id') id: string,
    @Body('direction') direction: 'UP' | 'DOWN',
    @Req() req: any,
  ) {
    return this.service.reorderQuestion(
      id,
      direction,
      req.user.orgId,
    );
  }
  @Get()
findAll(
  @Query('sectionId') sectionId: string,
  @Query('type') type: string,
  @Query('difficulty') difficulty: string,
  @Query('search') search: string,
  @Req() req: any,
) {
  return this.service.findAllForBuilder(
    req.user.orgId,
    sectionId,
    type,
    difficulty,
    search,
  );
}
@Get("bank")
getQuestionBank(
  @Query("sectionId") sectionId: string,
  @Query("type") type: string,
  @Query("difficulty") difficulty: string,
  @Query("search") search: string,
  @Req() req,
) {
  return this.service.getQuestionBank(
    sectionId,
    type,
    difficulty,
    search,
    req.user.orgId,
  );
}

  
}