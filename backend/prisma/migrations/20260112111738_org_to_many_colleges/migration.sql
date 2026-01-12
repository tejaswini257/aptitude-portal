/*
  Warnings:

  - A unique constraint covering the columns `[name,collegeId]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rollNo,collegeId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "College_orgId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_collegeId_key" ON "Department"("name", "collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_rollNo_collegeId_key" ON "Student"("rollNo", "collegeId");
