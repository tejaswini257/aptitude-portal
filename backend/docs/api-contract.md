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