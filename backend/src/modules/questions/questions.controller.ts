import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private readonly service: QuestionsService) {}

  // ================================
  // CREATE
  // ================================
  @Post()
  create(@Body() dto: CreateQuestionDto, @Req() req: any) {
    return this.service.create(dto, req.user);
  }

  // ================================
  // GET QUESTIONS BY TEST
  // ================================
  @Get('test/:testId')
  findByTest(@Param('testId') testId: string, @Req() req: any) {
    return this.service.findByTest(testId, req.user.orgId);
  }

  // ================================
  // UPDATE
  // ================================
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateQuestionDto>) {
    return this.service.update(id, dto);
  }

  // ================================
  // DELETE
  // ================================
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Patch(":id/reorder")
reorder(
  @Param("id") id: string,
  @Body("direction") direction: "UP" | "DOWN",
) {
  return this.service.reorder(id, direction);
}
}