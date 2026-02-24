import { Module } from '@nestjs/common';
import { InstructorController } from './instructor.controller';
import { CollegeInstructorController } from './college-instructor.controller';
import { InstructorService } from './instructor.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [InstructorController, CollegeInstructorController],
  providers: [InstructorService, PrismaService],
  exports: [InstructorService],
})
export class InstructorModule { }
