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
import { Query } from '@nestjs/common';


@Controller('questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private readonly service: QuestionsService) {}

  // ================================
  // CREATE
  // ================================
  @Post()
  create(@Body() dto: CreateQuestionDto, @Req() req: any) {
    return this.service.create(dto);
  }

  // 📄 Get Questions by Test
  //@Get()
  //findByTest(@Query('testId') testId: string) {
  //  return this.service.findByTest(testId);
  //}

  //GET questions by section
  @Get('section/:sectionId')
  findBySection(@Param('sectionId') sectionId: string) {
    return this.service.findBySection(sectionId);
  }

  // 🔍 Get Single Question
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
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