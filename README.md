# RentFlowInsight — Welile Rent Financing Platform

A full-stack SaaS platform that enables tenants to access rent financing, manage daily repayments, and connect with landlords and funders — all in one place.

---

## 📁 Project Structure

```
RENTFLOWINSIGHT/
├── backend/          # Node.js + Express + Prisma REST API
├── frontend/         # React 19 + Vite + TailwindCSS SPA
├── docker-compose.yml  # Local PostgreSQL & Redis services
├── schema.prisma     # Shared Prisma schema reference
└── package.json      # Root-level utilities
```

---

## ✅ Prerequisites

Make sure the following are installed on your machine before you begin:

| Tool | Version | Download |
|------|---------|---------|
| **Node.js** | v18+ | https://nodejs.org |
| **npm** | v9+ | Included with Node.js |
| **Docker Desktop** | Latest | https://www.docker.com/products/docker-desktop |
| **Git** | Any | https://git-scm.com |

---

## 🐳 Step 1 — Start the Local Database & Cache

The project uses PostgreSQL (port `5432`) and Redis (port `6379`) via Docker.

From the **project root**, run:

```bash
docker-compose up -d
```

This spins up:
- `welile-local-db` — PostgreSQL 15 database (`weliledb`)
- `welile-cache` — Redis 7 cache

To stop the services:

```bash
docker-compose down
```

> **Note:** Data is persisted in named Docker volumes (`pgdata`, `redisdata`), so your data survives container restarts.

---

## ⚙️ Step 2 — Configure the Backend

### 2a. Install dependencies

```bash
cd backend
npm install
```

### 2b. Set up environment variables

Create a copy of the environment file (or edit the existing one):

```bash
# backend/.env
DATABASE_URL="postgresql://postgres:password@localhost:5432/weliledb?schema=public"
JWT_SECRET="your-super-secret-key"
PORT=3000
```

> **Tip:** When using the local Docker database, use the connection string above. The `.env` file already in the repo points to a remote AWS RDS instance — swap it for local development.

### 2c. Run Prisma migrations

```bash
npx prisma migrate dev
```

This applies the schema to your local database and generates the Prisma Client.

To open Prisma Studio (database GUI):

```bash
npx prisma studio
```

---

## 🚀 Step 3 — Run the Backend

From the `backend/` directory:

```bash
# Development (with hot reload)
npm run dev

# Production
npm run build
npm run start
```

The API will be available at: **`http://localhost:3000`**

### Run Backend Tests

```bash
npm run test
```

---

## 🎨 Step 4 — Run the Frontend

From the **project root**, open a **new terminal**, then:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at: **`http://localhost:5173`**

### Other Frontend Commands

```bash
# Lint the code
npm run lint

# Build for production
npm run build

# Preview the production build
npm run preview
```

---

## 🔌 API Overview

The backend exposes REST API endpoints consumed by the frontend. Key routes include:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive a JWT |
| `POST` | `/auth/verify-otp` | Verify OTP for phone verification |
| `PUT` | `/applications/:id/step1` | Save tenant & rent details |
| `PUT` | `/applications/:id/step2` | Save payback calculation data |
| `PUT` | `/applications/:id/step3` | Upload identity documents |
| `PUT` | `/applications/:id/step4` | Submit local verification & consent |

---

## 🧭 Tenant Onboarding Flow

The platform guides tenants through the following pages:

```
/ (Landing)  →  /welcome  →  /signup  →  /tenant-agreement
→  /tenant-onboarding (4 steps)  →  /application-status  →  /dashboard
```

Refer to [`TENANT_FRONTEND_WORKFLOW.md`](./TENANT_FRONTEND_WORKFLOW.md) for the full step-by-step UI and API interaction spec.

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **ORM:** Prisma (PostgreSQL)
- **Auth:** JWT (`jsonwebtoken`) + `bcrypt`
- **File Uploads:** Multer
- **Security:** Helmet, CORS

### Frontend
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS 4
- **Routing:** React Router DOM v7
- **Data Fetching:** TanStack Query (React Query)
- **Charts:** Recharts
- **Maps:** React Leaflet
- **Icons:** Lucide React

---

## 🗄️ Database

- **Engine:** PostgreSQL 15
- **ORM:** Prisma
- **Schema file:** [`schema.prisma`](./schema.prisma)

To reset the database during development:

```bash
cd backend
npx prisma migrate reset
```

---

## 📝 Environment Variables Reference

| Variable | Location | Description |
|----------|----------|-------------|
| `DATABASE_URL` | `backend/.env` | PostgreSQL connection string |
| `JWT_SECRET` | `backend/.env` | Secret key for signing JWTs |
| `PORT` | `backend/.env` | Backend server port (default: `3000`) |

---

## 🔧 Troubleshooting

**Docker containers not starting**
- Ensure Docker Desktop is running before executing `docker-compose up -d`.
- Check if ports `5432` or `6379` are already in use and update `docker-compose.yml` accordingly.

**Prisma migration errors**
- Ensure the `DATABASE_URL` in `backend/.env` points to a running database.
- Run `npx prisma generate` if the Prisma Client is out of date.

**Frontend cannot reach the backend**
- Confirm the backend is running on `http://localhost:3000`.
- Check the `vite.config.ts` proxy settings if API calls are failing.
