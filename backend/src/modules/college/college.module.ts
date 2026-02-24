import { Module } from '@nestjs/common';
import { CollegesController } from './college.controller';
import { CollegesService } from './college.service';
import { PrismaModule } from '../../prisma/prisma.module';

import { PublicCollegeController } from './public-college.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CollegesController, PublicCollegeController],
  providers: [CollegesService],
})
export class CollegesModule { }
