import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { TestsService } from './tests.service';
import { CreateTestDto } from './dto/create-test.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateTestDto, @Req() req) {
    return this.testsService.create(dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.testsService.findAll();
  }
}

