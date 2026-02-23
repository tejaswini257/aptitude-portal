import { Module } from '@nestjs/common';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { TestSectionsController } from "./test-sections.controller";
import { TestSectionsService } from "./test-sections.service";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TestsController, TestSectionsController],
  providers: [TestsService, TestSectionsService],
})
export class TestsModule {}
