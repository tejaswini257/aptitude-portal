import { Module } from '@nestjs/common';
import { CollegesController } from './college.controller';
import { CollegesService } from './college.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CollegesController],
  providers: [CollegesService],
})
export class CollegesModule {}
