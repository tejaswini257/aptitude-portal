import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const tests = await prisma.test.findMany();
    console.log('Tests in DB:', tests);

    const users = await prisma.user.findMany({
        where: { role: 'COLLEGE_ADMIN' }
    });
    console.log('College Admins:', users);
}

main().catch(console.error).finally(() => prisma.$disconnect());
