# Environment Setup – Backend

This document describes how to configure and run the backend locally.

---

## Prerequisites

- Node.js 18+
- PostgreSQL (Neon Cloud)
- Git
- npm

---

## Environment Variables

Create a `.env` file inside `/backend`.

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
JWT_SECRET=supersecretkey
PORT=3001