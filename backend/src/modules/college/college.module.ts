import { Module } from '@nestjs/common';
import { CollegesController } from './college.controller';
import { CollegesService } from './college.service';

@Module({
  controllers: [CollegesController],
  providers: [CollegesService],
})
export class CollegesModule {}
