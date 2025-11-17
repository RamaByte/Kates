# Kaciuku Forum API

Kaciuku Forum is a RESTful API for managing cat photo albums, photos, and comments.  
Backend is built with Node.js, Express, Prisma ORM, PostgreSQL and JWT authentication (access + refresh tokens).

---

## Requirements

- Node.js
- npm
- PostgreSQL instance (local or managed, e.g. Supabase)
- Git

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/RamaByte/Kates.git
cd Kates/server
npm install
```

### 2. Environment configuration

Create a `.env` file in the project root (same level as `package.json`):

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

JWT_ACCESS_SECRET="your_access_token_secret"
JWT_REFRESH_SECRET="your_refresh_token_secret"

JWT_ACCESS_EXPIRES_IN="5m"
JWT_REFRESH_EXPIRES_IN="3d"
```

Do **not** commit `.env` to the repository.

### 3. Database migrations and seed data

```bash
npx prisma migrate dev
node prisma/seed.js
# optional full reset:
# npx prisma migrate reset
```

---

## Running the API

```bash
node src/index.js
```

By default:

- API base URL: `http://localhost:4000`
- Swagger UI: `http://localhost:4000/api-docs`

---