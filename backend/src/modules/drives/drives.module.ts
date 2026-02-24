import { Module } from '@nestjs/common';
import { DrivesService } from './drives.service';
import { DrivesController } from './drives.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { SubsciptionGuard } from '../../common/guards/subsciption.guard';

@Module({
  imports: [PrismaModule],
  controllers: [DrivesController],
  providers: [DrivesService, SubsciptionGuard],
})
export class DrivesModule {}
