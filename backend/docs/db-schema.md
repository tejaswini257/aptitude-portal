# Database Schema – Aptitude Portal

This document defines the authoritative Prisma schema and data relationships.

---

## Core Entities

### Organization
Represents a college or company.

Fields:
- id (UUID, PK)
- name (string)
- type (COLLEGE | COMPANY)
- createdAt

Relations:
- One Organization → Many Colleges
- One Organization → Many Users
- One Organization → Many Tests

---

### User
Authentication identity.

Fields:
- id (UUID, PK)
- email (unique)
- password (hashed)
- role (SUPER_ADMIN | COLLEGE_ADMIN | COMPANY_ADMIN | STUDENT)
- orgId (nullable FK → Organization)
- createdAt

Relations:
- One User → One Student (optional)
- One User → Many Tests Created

Indexes:
- email (unique)
- orgId

---

### College
Registered educational institution.

Fields:
- id (UUID, PK)
- orgId (unique FK → Organization)
- collegeName
- collegeType
- address
- contactPerson
- contactEmail
- mobile
- maxStudents
- isApproved
- createdAt

Relations:
- One College → Many Departments
- One College → Many Students

Indexes:
- orgId

---

### Department
Academic department inside a college.

Fields:
- id (UUID, PK)
- name
- collegeId (FK → College)
- createdAt

Relations:
- One Department → Many Students

Constraints:
- Unique(name, collegeId)

Indexes:
- collegeId

---

### Student
Student profile linked to a user.

Fields:
- id (UUID, PK)
- rollNo
- year
- userId (unique FK → User)
- collegeId (FK → College)
- departmentId (FK → Department)
- createdAt

Relations:
- One Student → Many Submissions

Constraints:
- Unique(rollNo, collegeId)

Indexes:
- departmentId
- collegeId

---

### Test
Assessment definition.

Fields:
- id
- name
- description
- type (APTITUDE | CODING | MIXED)
- duration
- status
- showResultImmediately
- proctoringEnabled
- eligibilityCriteria (JSON)
- proctoringConfig (JSON)
- createdById (FK → User)
- organizationId (FK → Organization)

Relations:
- One Test → Many Questions
- One Test → Many Submissions

---

### Question
Individual test question.

Fields:
- id
- testId (FK → Test)
- sectionId (optional)
- type
- difficulty
- title
- description
- options (JSON)
- correctAnswer (JSON)
- marks
- order

Relations:
- One Question → Many SubmissionAnswers

Indexes:
- testId
- sectionId

---

### Submission
Student attempt for a test.

Fields:
- id
- studentId (FK → Student)
- testId (FK → Test)
- status
- score
- startedAt
- submittedAt
- evaluatedAt

Constraints:
- Unique(studentId, testId)

Relations:
- One Submission → Many SubmissionAnswers

Indexes:
- studentId
- testId

---

### SubmissionAnswer
Individual answer per question.

Fields:
- id
- submissionId (FK → Submission)
- questionId (FK → Question)
- selectedAnswer
- isCorrect
- marksObtained

Constraints:
- Unique(submissionId, questionId)

---

## Data Integrity Rules

- A student can attempt a test only once.
- Deleting parent records must respect foreign key constraints.
- Authentication users must exist before student records.
- All IDs are UUID.