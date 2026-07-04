# Pixel Pond

A cozy pixel-art fishing web application. Full Stack Bootcamp final project — see `01-PRD.md` through `05-CLAUDE.md` for the project spec.

**Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS + DaisyUI, Auth.js (GitHub OAuth), Prisma, Supabase (PostgreSQL + Storage), React Hook Form, Zod, TanStack Query.

## Local Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Copy `.env.example` to `.env` and fill in real values:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL` / `DIRECT_URL` — from your Supabase project's Connection settings (`DATABASE_URL` uses the pooled connection on port 6543, `DIRECT_URL` uses the direct connection on port 5432 — Prisma migrations require the direct one).
   - `NEXTAUTH_URL` — `http://localhost:3000` for local dev.
   - `NEXTAUTH_SECRET` — generate with `npx auth secret` or `openssl rand -base64 32`.
   - `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` — from a GitHub OAuth App ([github.com/settings/developers](https://github.com/settings/developers)). Set its callback URL to `http://localhost:3000/api/auth/callback/github` for local dev.
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` — from your Supabase project's API settings.

3. **Run database migrations**

   Creates all tables (`profiles`, `fish_species`, `inventory`, `catches`, `rods`, `player_rods`, `transactions`, plus the Auth.js tables) in your Supabase Postgres database:

   ```bash
   npm run db:migrate
   ```

4. **Seed fish species and rods**

   ```bash
   npm run db:seed
   ```

5. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

6. **Promote your first admin**

   Every new sign-in is created with the `player` role. There's no bootstrap-admin flow by design (matches the RBAC model) — promote yourself once, directly in the database, after your first GitHub sign-in:

   ```sql
   update profiles set role = 'admin' where user_id = (
     select id from users where email = 'you@example.com'
   );
   ```

   Run this in the Supabase SQL editor. After promoting, every `/admin/*` route and admin Server Action becomes available to that account (checked via `requireAdmin()` in `lib/profile.ts` and enforced again by `middleware.ts`).

## Project Structure

See `03-ARCHITECTURE.md` for the full layout. Key entry points:

- `app/` — routes (App Router). `(auth)/login`, player routes (`dashboard`, `fishing`, `inventory`, `collection`, `shop`, `market`, `profile`), and `admin/*`.
- `actions/` — Server Actions (business logic, RBAC-checked).
- `components/` — shared UI, including `components/admin/` for the admin panel.
- `lib/` — Prisma client, Supabase clients, session/role helpers, shared Zod schemas.
- `prisma/schema.prisma` — the data model. `prisma/seed.ts` — seed data.

## Deploying to Vercel

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import the repo into Vercel** ([vercel.com/new](https://vercel.com/new)). Framework preset is auto-detected as Next.js.

3. **Set environment variables** in the Vercel project settings — the same ones from `.env.example`, with production values:
   - `NEXTAUTH_URL` → your production URL (e.g. `https://pixel-pond.vercel.app`).
   - Add a second GitHub OAuth App (or a second callback URL) pointing to `https://<your-domain>/api/auth/callback/github`.
   - `DATABASE_URL` / `DIRECT_URL` → same Supabase project (or a separate production project).

4. **Run migrations against production** once, before or after the first deploy:

   ```bash
   npm run db:deploy
   npm run db:seed
   ```

   (`db:deploy` runs `prisma migrate deploy`, which applies committed migrations without generating new ones — the correct command for CI/production, as opposed to `db:migrate` which is for local development.)

5. **Deploy.** Vercel runs `npm install` (which triggers `postinstall: prisma generate`) and then `npm run build` automatically — no extra build configuration needed.

6. Promote your production admin the same way as step 6 in Local Setup, against the production database.
