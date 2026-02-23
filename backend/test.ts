import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.user.findFirst({ where: { email: "google@admin.com" } }).then(console.log).finally(() => prisma.$disconnect());
