-- AlterEnum
-- Add UNSEEN_PARAGRAPH to SectionType enum in PostgreSQL (schema already has it; DB was not migrated)
ALTER TYPE "SectionType" ADD VALUE 'UNSEEN_PARAGRAPH';
