# API Contract – Aptitude Portal Backend

All APIs are JSON-based and secured using JWT unless stated.

Base URL:

http://localhost:3001

---

# 🔐 Authentication

## Register User

POST /auth/register

Request Body:
```json
{
  "email": "user@test.com",
  "password": "Password@123",
  "role": "STUDENT"
}

## Department APIs

### GET /departments?collegeId={uuid}
Returns all departments under a college.

### GET /departments/{id}
Returns a single department by ID.

Response:
{
  id: string
  name: string
  collegeId: string
  createdAt: string
}

### POST /departments
Body:
{
  name: string
  collegeId: string
}

Roles: SUPER_ADMIN, COLLEGE_ADMIN

### PUT /departments/{id}
Body:
{
  name: string
}

Roles: SUPER_ADMIN, COLLEGE_ADMIN

### DELETE /departments/{id}
Roles: SUPER_ADMIN, COLLEGE_ADMIN