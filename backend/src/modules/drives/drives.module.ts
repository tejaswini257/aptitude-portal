import { Module } from '@nestjs/common';
import { DrivesService } from './drives.service';
import { DrivesController } from './drives.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DrivesController],
  providers: [DrivesService],
})
export class DrivesModule {}
