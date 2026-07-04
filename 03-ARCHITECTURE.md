# 03-ARCHITECTURE.md

# Pixel Pond Architecture

**Version:** 1.0 (MVP)

------------------------------------------------------------------------

# 1. Overview

Pixel Pond follows a simple Full Stack architecture designed for a
bootcamp MVP.

Goals:

-   Keep the project simple
-   Prefer Server Actions over unnecessary API routes
-   Keep the project deployable at all times
-   Follow a clear folder structure
-   Separate UI, business logic, and database access

------------------------------------------------------------------------

# 2. Technology Stack

## Frontend

-   Next.js 15 (App Router)
-   TypeScript
-   Tailwind CSS
-   DaisyUI

## Authentication

-   Auth.js (NextAuth)
-   GitHub OAuth

## Backend

-   Server Actions
-   Route Handlers (only when necessary)

## Database

-   Supabase PostgreSQL

## Storage

-   Supabase Storage

## Deployment

-   GitHub
-   Vercel

------------------------------------------------------------------------

# 3. High-Level Architecture

``` text
Browser
    │
    ▼
Next.js App Router
    │
    ▼
Server Actions
    │
    ▼
Supabase
    │
    ▼
PostgreSQL
```

------------------------------------------------------------------------

# 4. Project Structure

``` text
app/
│
├── (auth)/
│   └── login/
│
├── dashboard/
├── fishing/
├── inventory/
├── collection/
├── market/
├── shop/
├── profile/
│
├── admin/
│   ├── fish/
│   └── rods/
│
├── api/
│
├── layout.tsx
└── page.tsx

actions/
components/
lib/
types/
utils/
middleware.ts
```

------------------------------------------------------------------------

# 5. Routing

  Route         Access
  ------------- --------
  /             Public
  /login        Public
  /dashboard    Player
  /fishing      Player
  /inventory    Player
  /collection   Player
  /market       Player
  /shop         Player
  /profile      Player
  /admin        Admin
  /admin/fish   Admin
  /admin/rods   Admin

------------------------------------------------------------------------

# 6. Authentication Flow

``` text
GitHub Login
      │
      ▼
Auth.js
      │
      ▼
Session
      │
      ▼
Profile Lookup
      │
      ▼
Dashboard
```

-   GitHub OAuth is the only login method.
-   A Profile is automatically created on first sign-in.
-   Every action is linked to the authenticated profile.

------------------------------------------------------------------------

# 7. Role-Based Access Control (RBAC)

## Player

-   Dashboard
-   Fishing
-   Inventory
-   Collection
-   Market
-   Shop
-   Profile

## Admin

-   Fish Management
-   Rod Management
-   Admin Dashboard

Middleware protects all private pages.

Server Actions validate user roles before performing database
operations.

------------------------------------------------------------------------

# 8. Data Flow

## Fishing

``` text
Click "Go Fishing"
        │
        ▼
Server Action
        │
        ▼
Load Equipped Rod
        │
        ▼
Calculate Luck Bonus
        │
        ▼
Random Fish
        │
        ▼
Insert Catch History
        │
        ▼
Update Inventory
        │
        ▼
Return Result
```

## Sell Fish

``` text
Sell Fish
    │
    ▼
Validate Inventory
    │
    ▼
Update Inventory
    │
    ▼
Increase Gold
    │
    ▼
Create Transaction
```

## Buy Rod

``` text
Buy Rod
   │
   ▼
Check Gold
   │
   ▼
Create Player Rod
   │
   ▼
Update Gold
```

## Equip Rod

``` text
Select Rod
    │
    ▼
Update Profile
    │
    ▼
Equipped Successfully
```

------------------------------------------------------------------------

# 9. Middleware Responsibilities

-   Protect authenticated routes.
-   Redirect unauthenticated users to /login.
-   Restrict Admin pages to Admin users.
-   Prevent unauthorized Server Actions.

------------------------------------------------------------------------

# 10. Development Principles

-   Keep the project simple.
-   Do not over-engineer.
-   Prefer Server Actions over API Routes.
-   Reuse components whenever possible.
-   Use strict TypeScript.
-   Keep business logic inside Server Actions.
-   Store all persistent data in Supabase.
-   Keep the application production-ready.

------------------------------------------------------------------------

# 11. Environment Variables

``` text
NEXTAUTH_URL
NEXTAUTH_SECRET

AUTH_GITHUB_ID
AUTH_GITHUB_SECRET

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY
```

------------------------------------------------------------------------

# 12. Deployment Flow

``` text
Local Development
        │
        ▼
Git Commit
        │
        ▼
GitHub Repository
        │
        ▼
Vercel Deployment
        │
        ▼
Production Application
        │
        ▼
Supabase PostgreSQL
```

------------------------------------------------------------------------

# 13. Architecture Decisions

-   App Router only.
-   GitHub OAuth only.
-   Supabase is the single source of truth.
-   Server Actions are preferred over REST APIs.
-   UUID is used for all custom tables.
-   All protected actions require authentication.
-   RBAC is enforced in both Middleware and Server Actions.
-   The architecture is intentionally lightweight for rapid MVP
    development.
