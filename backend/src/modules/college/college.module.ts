import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { CollegesController } from './college.controller';
import { CollegesService } from './college.service';

@Module({
  controllers: [CollegesController],
  providers: [CollegesService],
})
export class CollegesModule {}
=======
import { CollegeController } from './college.controller';
import { CollegeService } from './college.service';

@Module({
  controllers: [CollegeController],
  providers: [CollegeService],
})
export class CollegeModule {}
>>>>>>> ccc50dd65c65df8ff30d736b8382cf9ed7bb1034
