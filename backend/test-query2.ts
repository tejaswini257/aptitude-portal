import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const tests = await prisma.test.findMany();
    console.log('Tests DB:', tests);
}

main().catch(console.error).finally(() => prisma.$disconnect());
