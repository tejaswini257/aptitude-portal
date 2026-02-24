import { Module } from '@nestjs/common';
import { PracticeSetsService } from './practice-sets.service';
import { PracticeSetsController } from './practice-sets.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PracticeSetsController],
  providers: [PracticeSetsService],
})
export class PracticeSetsModule {}
