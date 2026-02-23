import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    try {
        const user = await prisma.user.findFirst({ where: { email: "google@admin.com" } });
        console.log("User:", user);
        if (!user) return;
        try {
            const blocked = await prisma.$queryRawUnsafe(`SELECT reason FROM blocked_users WHERE user_id = $1`, user.id);
            console.log("Blocked:", blocked);
        } catch (e: any) {
            console.error("Prisma error for blocked:", e.message);
        }
    } catch (e: any) {
        console.error("Main error:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}
main();
