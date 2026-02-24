import { Module } from '@nestjs/common';
import { TestController } from './tests.controller';
import { TestService } from './tests.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [TestController],
  providers: [TestService, PrismaService],
})
export class TestsModule {}
