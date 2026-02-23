# Deploying Aptitude Portal

This guide covers deploying the **frontend** to [Vercel](https://vercel.com) and the **backend** to [Railway](https://railway.com). The repo is: [https://github.com/tejaswini257/aptitude-portal](https://github.com/tejaswini257/aptitude-portal).

---

## Prerequisites

- GitHub repo pushed: [aptitude-portal](https://github.com/tejaswini257/aptitude-portal)
- A **PostgreSQL** database (e.g. [Neon](https://neon.tech), [Railway PostgreSQL](https://railway.app), or [Supabase](https://supabase.com))
- Accounts on [Vercel](https://vercel.com) and [Railway](https://railway.com)

---

## 1. Deploy Backend on Railway

Deploy the backend first so you have an API URL to use in the frontend.

### 1.1 Create a new project on Railway

1. Go to [railway.app](https://railway.app) and sign in (e.g. with GitHub).
2. Click **New Project**.
3. Choose **Deploy from GitHub repo** and select `tejaswini257/aptitude-portal` (or your fork).
4. When asked “What do you want to deploy?”, choose **Configure a service** or **Add a service** and pick **GitHub Repo** again, then select the repo.

### 1.2 Set root directory and build settings

1. Open the **backend** service (the one linked to your repo).
2. Go to **Settings** (or **Variables** / **Settings**).
3. Set **Root Directory** to: `backend`.
4. Set **Build Command** to:
   ```bash
   npx prisma generate && npm run build
   ```
5. Set **Start Command** to:
   ```bash
   npm run start:prod
   ```
6. Set **Watch Paths** (optional) to `backend/**` so only backend changes trigger deploys.

### 1.3 Add a PostgreSQL database (if you don’t have one)

1. In the same Railway project, click **New** → **Database** → **PostgreSQL**.
2. After it’s created, open the PostgreSQL service and go to **Variables** or **Connect**.
3. Copy the `DATABASE_URL` (or the connection string Railway provides).

### 1.4 Set environment variables

In your **backend** service on Railway, open **Variables** and add:

| Variable        | Value / description |
|----------------|---------------------|
| `DATABASE_URL` | Your PostgreSQL connection string (from Railway DB or Neon/Supabase). |
| `JWT_SECRET`   | A long random string (e.g. from `openssl rand -base64 32`). |
| `CORS_ORIGIN`  | Your Vercel frontend URL, e.g. `https://your-app.vercel.app` (no trailing slash). |
| `PORT`         | Optional; Railway sets this automatically. |

If you use a different env name for the frontend URL, you can set **FRONTEND_URL** instead; the backend uses `CORS_ORIGIN || FRONTEND_URL`.

### 1.5 Deploy and get the backend URL

1. Trigger a deploy (push to main or **Deploy** in Railway).
2. In the backend service, open **Settings** → **Networking** (or **Deployments** → your deployment).
3. Click **Generate Domain** to get a public URL, e.g. `https://your-backend.up.railway.app`.
4. Copy this URL; you’ll use it as **NEXT_PUBLIC_API_URL** in Vercel.

### 1.6 Run database migrations

Run migrations against the production DB once (from your machine or Railway shell):

```bash
cd backend
export DATABASE_URL="your-production-database-url"
npx prisma migrate deploy
```

If you use Railway’s PostgreSQL, you can get `DATABASE_URL` from the DB service variables and run the same command locally with that value.

---

## 2. Deploy Frontend on Vercel

### 2.1 Import the project

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. Click **Add New** → **Project**.
3. Import `tejaswini257/aptitude-portal` (or your repo).

### 2.2 Configure the monorepo

1. Set **Root Directory** to `frontend` (click **Edit** next to the root).
2. **Framework Preset**: Vercel should detect Next.js.
3. **Build Command**: leave default (`next build`) or set to `npm run build`.
4. **Output Directory**: leave default (e.g. `.next`).
5. **Install Command**: `npm install` (default).

### 2.3 Set environment variable

In the project **Settings** → **Environment Variables**, add:

| Name                   | Value |
|------------------------|--------|
| `NEXT_PUBLIC_API_URL`  | Your Railway backend URL, e.g. `https://your-backend.up.railway.app` |

Use the same value for **Production**, **Preview**, and **Development** if you want preview/development to use the same API.

No trailing slash in the URL.

### 2.4 Deploy

1. Click **Deploy**.
2. After the build finishes, open the deployment URL (e.g. `https://your-app.vercel.app`).

### 2.5 Point backend CORS to the live frontend

In Railway, ensure the backend variable **CORS_ORIGIN** (or **FRONTEND_URL**) is set to your **actual** Vercel URL, e.g.:

- `https://your-app.vercel.app`

If you use multiple domains (e.g. preview URLs), you can set:

- `CORS_ORIGIN=https://your-app.vercel.app,https://*.vercel.app`

(Backend accepts comma-separated origins.) Then redeploy the backend.

---

## 3. Quick checklist

**Railway (backend)**

- [ ] Root directory: `backend`
- [ ] Build: `npx prisma generate && npm run build`
- [ ] Start: `npm run start:prod`
- [ ] `DATABASE_URL` set and migrations run (`npx prisma migrate deploy`)
- [ ] `JWT_SECRET` set
- [ ] `CORS_ORIGIN` (or `FRONTEND_URL`) set to Vercel URL
- [ ] Public domain generated and URL copied

**Vercel (frontend)**

- [ ] Root directory: `frontend`
- [ ] `NEXT_PUBLIC_API_URL` set to Railway backend URL
- [ ] Deploy successful and app loads

**After first deploy**

- [ ] Open frontend URL and test login/register.
- [ ] If you see CORS errors, double-check `CORS_ORIGIN` and that it matches the frontend origin exactly (including `https`).

---

## 4. Optional: same repo, two services

- **Vercel**: one project, root = `frontend`.
- **Railway**: one service, root = `backend`; optional second service for PostgreSQL.

Pushing to `main` can deploy both if both are connected to the same repo; use **Root Directory** and **Watch Paths** so only the relevant app is rebuilt.

---

## 5. Troubleshooting

| Issue | What to check |
|-------|----------------|
| Frontend can’t reach API | `NEXT_PUBLIC_API_URL` in Vercel = exact Railway backend URL (no trailing slash). |
| CORS errors in browser | Backend `CORS_ORIGIN` (or `FRONTEND_URL`) = exact Vercel URL (e.g. `https://xxx.vercel.app`). |
| 401 / JWT errors | Same `JWT_SECRET` on backend; token stored and sent correctly (e.g. `Authorization: Bearer <token>`). |
| DB errors on Railway | `DATABASE_URL` correct; migrations run with `npx prisma migrate deploy`. |
| Build fails on Railway | Root directory = `backend`; build command includes `npx prisma generate && npm run build`. |

---

Repo: [https://github.com/tejaswini257/aptitude-portal](https://github.com/tejaswini257/aptitude-portal)
