/*
  Warnings:

  - A unique constraint covering the columns `[orgId]` on the table `College` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "College_orgId_key" ON "College"("orgId");
