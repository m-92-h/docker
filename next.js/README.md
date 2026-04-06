# MEENA Project — Next.js + Docker + PostgreSQL

A full-stack web application built with **Next.js**, containerized with **Docker**, and automated with **GitHub Actions CI/CD**.

---

## 🧱 Tech Stack

| Layer | Technology | Docker Image |
|---|---|---|
| Frontend & Backend | Next.js 16 (App Router) | `node:24-alpine` |
| Database | PostgreSQL 18 | `postgres:18-alpine` |
| Reverse Proxy | Nginx | `nginx:alpine` |
| SSL Certificates | Let's Encrypt | `certbot/certbot:latest` |

---

## 📁 Project Structure

```
NEXT.JS/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions — Auto build & deploy
├── .next/                      # Next.js build output (auto-generated)
├── init-db/                    # SQL scripts run on DB first launch
│   └── init.sql                # Creates tables on container startup
├── node_modules/               # Dependencies (auto-generated)
├── public/                     # Static assets
├── src/
│   └── app/
│       └── page.tsx            # Main page — UI + Server Actions
│   └── lib/
│       └── db.ts               # PostgreSQL connection client
├── .dockerignore               # Files excluded from Docker build
├── .env                        # Environment variables (never commit this)
├── .env.local                  # Local dev overrides (never commit this)
├── .gitignore                  # Files excluded from Git
├── docker-compose.yml          # Orchestrates all containers together
├── Dockerfile                  # Instructions to build the app image
├── next.config.ts              # Next.js configuration
├── nginx.conf                  # Nginx reverse proxy configuration
├── package.json                # Project dependencies
└── tsconfig.json               # TypeScript configuration
```

---

## 📄 Files You Must Create

### 1. `.env` — Environment Variables
**Location:** root of the project (same level as `docker-compose.yml`)

```properties
# Database Configuration
DB_NAME=meena_db
DB_USER=meena_user
DB_PASSWORD=your_strong_password_here

# Database URL for local development
DATABASE_URL=postgres://meena_user:your_strong_password_here@localhost:5432/meena_db
```

> ⚠️ This file is listed in `.gitignore` and must **never** be pushed to GitHub.

---

### 2. `.env.local` — Local Development Override
**Location:** root of the project

Next.js loads `.env.local` with higher priority than `.env` in development mode. This file is **required** for `npm run dev` to read environment variables correctly.

```bash
cp .env .env.local
```

> ⚠️ This file is also listed in `.gitignore` and must **never** be pushed to GitHub.

---

### 3. `init-db/init.sql` — Database Initialization
**Location:** `init-db/init.sql`

This file runs **automatically** the first time the PostgreSQL container starts. It creates your tables so you don't have to do it manually.

```sql
CREATE TABLE IF NOT EXISTS messages (
    id         SERIAL PRIMARY KEY,
    content    TEXT        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 4. `src/lib/db.ts` — Database Client
**Location:** `src/lib/db.ts`

```typescript
import postgres from "postgres";

export interface Message {
  id: number;
  content: string;
  created_at: Date;
}

const sql = postgres(process.env.DATABASE_URL!);

export default sql;
```

---

### 5. `next.config.ts` — Standalone Output
**Location:** root of the project

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
};

export default nextConfig;
```

> `output: "standalone"` is required for Docker. Without it the container crashes with `Cannot find module '/app/server.js'`.

---

## 🖥️ Running Locally (Development)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [Node.js 20+](https://nodejs.org/) installed

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

**2. Create environment files**
```bash
cp .env.example .env
# Edit .env with your values, then:
cp .env .env.local
```

**3. Start the database only**
```bash
docker-compose up -d db
```

> We start only `db` because Next.js runs locally via `npm run dev`, not inside Docker.

**4. Install dependencies and run**
```bash
npm install
npm run dev
```

**5. Open in browser**
```
http://localhost:3000
```

---

## 🐳 Running with Docker (Full Stack)

This runs everything inside Docker — Next.js, PostgreSQL, and Nginx together.

```bash
docker-compose up -d --build

# Open in browser
http://localhost
```

### Useful Commands
```bash
docker ps                          # View running containers
docker logs node_app               # View app logs
docker logs postgres_db            # View database logs
docker-compose down                # Stop all containers
docker-compose down -v             # Stop and delete all data
docker-compose build --no-cache    # Rebuild from scratch
```

---

## 🚀 Deploying to Production

### Option 1 — Railway (Easiest) ⭐

[Railway](https://railway.app) supports Docker natively and provides a managed PostgreSQL database.

**Steps:**

1. Push your project to GitHub
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
3. Select your repository — Railway detects your `Dockerfile` automatically
4. Add a database: **+ New** → **Database** → **PostgreSQL**
5. Go to your app service → **Variables** tab → add:
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
```
Railway links the database URL automatically.

6. Your app gets a live public URL:
```
https://your-app.up.railway.app
```

---

### Option 2 — Render

[Render](https://render.com) offers a free tier for web services and PostgreSQL.

**Steps:**

1. Push your project to GitHub
2. Go to [render.com](https://render.com) → **New** → **Web Service**
3. Connect your GitHub repository
4. Set:
   - **Environment:** Docker
   - **Dockerfile Path:** `./Dockerfile`
5. Create a database: **New** → **PostgreSQL**
6. Copy the **Internal Database URL** from the database dashboard
7. In your web service → **Environment** tab → add:
```
DATABASE_URL=your_internal_database_url
```
8. Your app gets a public URL:
```
https://your-app.onrender.com
```

---

### Option 3 — VPS with GitHub Actions (Full Control)

For production servers (DigitalOcean, Hetzner, AWS EC2, etc.) using the CI/CD pipeline in `.github/workflows/ci.yml`.

**Steps:**

**1. Push to GitHub**
```bash
git add .
git commit -m "initial commit"
git push origin main
```

**2. Add GitHub Secrets**

Go to your repo → `Settings → Secrets and variables → Actions`:

| Secret | Value |
|---|---|
| `SERVER_HOST` | Your server's IP address |
| `SERVER_USER` | SSH username (e.g. `ubuntu`) |
| `SERVER_SSH_KEY` | Contents of `~/.ssh/id_rsa` |

**3. First time setup on the server**
```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Clone the repo
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# Create .env
nano .env

# Start everything
docker-compose up -d
```

**4. After that — every `git push` to `main` triggers automatically:**
```
git push
  → GitHub Actions builds the Docker image
  → Pushes it to ghcr.io
  → SSHes into your server
  → Pulls the new image
  → Restarts the containers
  → Cleans up old images
```

---

## 🔒 Enabling SSL on VPS (Production Only)

> Only works with a real domain — Let's Encrypt does not support `localhost`.

```bash
# 1. Start with HTTP only
docker-compose up -d

# 2. Request the SSL certificate
docker-compose run --rm certbot

# 3. Open nginx.conf and uncomment the HTTPS server block

# 4. Reload Nginx (no rebuild needed)
docker-compose restart nginx
```

---

## 🐳 Docker Images Explained

### `node:24-alpine`
Used in the **Dockerfile** across 3 build stages:
- **deps** — installs npm packages
- **builder** — compiles the Next.js application
- **runner** — minimal final image (~75MB) that only runs `server.js`

### `postgres:18-alpine`
Runs PostgreSQL. On first launch it creates the database, user, and executes every `.sql` file in `init-db/`.

### `nginx:alpine`
Reverse proxy — receives requests on port `80`/`443` and forwards them internally to `node_app:3000`. Also handles SSL termination.

### `certbot/certbot:latest`
Requests free SSL certificates from Let's Encrypt using the webroot challenge via a shared volume with Nginx.

---

## 🔄 GitHub Actions — CI/CD Pipeline

**Location:** `.github/workflows/ci.yml`

### Job 1: `build-and-push`
1. Checks out your code
2. Builds the Docker image using your `Dockerfile`
3. Pushes it to `ghcr.io/YOUR_USERNAME/YOUR_REPO`
4. Uses registry cache so subsequent builds are much faster

### Job 2: `deploy`
Runs only after Job 1 succeeds:
1. SSHes into your production server
2. Pulls the newly pushed image
3. Restarts containers
4. Cleans up old unused images to save disk space

---

## 📌 Important Notes

- Remove the `volumes` mount from the `app` service in `docker-compose.yml` in production — it overwrites the built image contents.
- The `postgres_data` volume persists your database between restarts. Use `docker-compose down -v` only to reset all data.
- Always use `.env.local` for local development — Next.js gives it higher priority than `.env`.
- `NEXT_TELEMETRY_DISABLED=1` prevents Next.js from sending build analytics to Vercel.