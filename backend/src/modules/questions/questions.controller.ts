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
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionsService } from './questions.service';
import { Req } from '@nestjs/common';


import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';


@Controller('questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private readonly service: QuestionsService) {}

  @Post()
  create(@Body() dto: any, @Req() req: any) {
    return this.service.create(dto, req.user.orgId);
  }

  @Get('test/:testId')
  findByTest(@Param('testId') testId: string) {
    return this.service.findByTest(testId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
