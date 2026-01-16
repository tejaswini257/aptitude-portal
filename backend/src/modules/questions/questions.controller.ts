import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('questions')
export class QuestionsController {
  constructor(private readonly service: QuestionsService) {}

  // ➕ Create Question
  @Post()
  create(@Body() dto: CreateQuestionDto) {
    return this.service.create(dto);
  }

  // 📄 Get Questions by Test
  @Get()
  findByTest(@Query('testId') testId: string) {
    return this.service.findByTest(testId);
  }

  // 🔍 Get Single Question
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ✏️ Update Question
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
    return this.service.update(id, dto);
  }

  // ❌ Delete Question
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
