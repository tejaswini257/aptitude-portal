import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Restoring Question Bank Sections...');

    // Find all sections that are NOT associated with any test
    // and set isQuestionBank to true.

    // To avoid accidentally targeting sections that ARE associated with tests,
    // we check the TestSection relation.

    const sections = await prisma.section.findMany({
        include: {
            testSections: true,
        }
    });

    let updatedCount = 0;

    for (const section of sections) {
        if (section.testSections.length === 0 && !section.isQuestionBank) {
            // It's not attached to a test, so it was probably a question bank
            await prisma.section.update({
                where: { id: section.id },
                data: { isQuestionBank: true }
            });
            updatedCount++;
        }
    }

    console.log(`Updated ${updatedCount} sections to be Question Banks.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
