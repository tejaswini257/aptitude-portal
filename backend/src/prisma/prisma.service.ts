import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await this.$connect();
        return;
      } catch (err: any) {
        const isLast = attempt === MAX_RETRIES;
        console.warn(
          `[Prisma] Database connection attempt ${attempt}/${MAX_RETRIES} failed: ${err?.message || err}`,
        );
        if (isLast) {
          console.error(
            '[Prisma] Cannot reach database. Check: 1) DATABASE_URL in .env (Neon: use ?sslmode=require), 2) Neon project is active in dashboard, 3) Network/firewall.',
          );
          throw err;
        }
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
