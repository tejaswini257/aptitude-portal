import { Controller, Get } from '@nestjs/common';
import { CollegeService } from './college.service';

@Controller('colleges')
export class CollegeController {
  constructor(private readonly collegeService: CollegeService) {}

  @Get()
  findAll() {
    return this.collegeService.findAll();
  }
}