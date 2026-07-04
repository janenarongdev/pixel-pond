# 01-PRD.md

# Pixel Pond

**Version:** 1.0 (MVP)\
**Project Type:** Full Stack Web Application\
**Status:** Planning\
**Deployment:** GitHub + Vercel\
**Database:** Supabase PostgreSQL

------------------------------------------------------------------------

# 1. Project Overview

**Pixel Pond** is a pixel-art fishing web application where players sign
in with GitHub, catch fish, collect them, sell them for Gold, and
purchase better fishing rods to improve their chances of obtaining rare
fish.

Although presented as a game, the project is intentionally designed as a
**Game-Inspired CRUD Application** for a Full Stack Bootcamp final
project. Its primary goal is to demonstrate authentication,
authorization, relational database design, CRUD operations, deployment,
and clean software architecture.

------------------------------------------------------------------------

# 2. Project Goals

The application must:

-   Use Next.js 15 (App Router)
-   Use TypeScript
-   Use Auth.js (NextAuth)
-   Support GitHub OAuth authentication
-   Use Supabase PostgreSQL
-   Use Supabase Storage
-   Implement Role-Based Access Control (RBAC)
-   Include at least five custom database tables (excluding Auth.js
    tables)
-   Provide Admin CRUD functionality
-   Be version-controlled with GitHub
-   Be deployed to Vercel
-   Be accessible through a Production URL
-   Be fully explainable during Viva examination

------------------------------------------------------------------------

# 3. User Roles

## Player

Players can:

-   Sign in with GitHub
-   Log out
-   Go fishing
-   View Dashboard
-   View Inventory
-   View Fish Collection
-   Sell fish
-   Purchase fishing rods
-   Equip a fishing rod
-   View their profile

## Admin

Administrators can:

-   Create, update and delete fish species
-   Create, update and delete fishing rods
-   View player information

------------------------------------------------------------------------

# 4. Core Gameplay Loop

``` text
Login
↓
Dashboard
↓
Go Fishing
↓
Random Fish
↓
Save Catch History
↓
Update Inventory
↓
Sell Fish
↓
Receive Gold
↓
Buy Better Rod
↓
Equip Rod
↓
Repeat
```

------------------------------------------------------------------------

# 5. Functional Requirements

## Authentication

-   GitHub OAuth using Auth.js
-   Persistent session management
-   Automatically create a player profile after first login

## Dashboard

Display:

-   Username
-   GitHub avatar
-   Current Gold
-   Equipped rod
-   Total fish owned
-   Go Fishing button

## Fishing

Each fishing action must:

1.  Validate the authenticated session.
2.  Load the player's profile.
3.  Read the equipped rod.
4.  Apply rod luck bonus.
5.  Randomly determine a fish using predefined drop rates.
6.  Save the catch history.
7.  Update the player's inventory.
8.  Display the fishing result.

## Inventory

Players can:

-   View owned fish
-   View quantity
-   View selling price
-   Sell fish

## Fish Collection

Display every fish species in the game.

Rarity:

-   Common
-   Rare
-   Epic
-   Legendary

Undiscovered fish appear as **Unknown**.

## Fish Market

Selling fish will:

-   Reduce inventory quantity
-   Increase player Gold
-   Create a transaction record

## Rod Shop

Players can:

-   Browse rods
-   Purchase rods
-   Equip owned rods

Each rod includes:

-   Name
-   Price
-   Luck Bonus
-   Image

## Admin Panel

Fish CRUD

-   Create
-   Read
-   Update
-   Delete

Rod CRUD

-   Create
-   Read
-   Update
-   Delete

------------------------------------------------------------------------

# 6. Authentication & Authorization

## Authentication

-   Auth.js (NextAuth)
-   GitHub OAuth

## Roles

-   Player
-   Admin

Authorization requirements:

-   Middleware must protect private routes.
-   Admin routes must be inaccessible to players.
-   API routes and Server Actions must validate user roles.

------------------------------------------------------------------------

# 7. Economy

Gold is the only in-game currency.

Players earn Gold by:

-   Selling fish

Players spend Gold by:

-   Purchasing fishing rods

------------------------------------------------------------------------

# 8. Business Rules

-   Authentication is required before using the application.
-   Every player owns an independent profile.
-   All gameplay data is linked to the authenticated user.
-   One fishing action returns exactly one fish.
-   Every fishing attempt creates a catch history record.
-   Fish probabilities are based on predefined drop rates.
-   Total drop rates equal 100%.
-   Fish can only be sold if present in inventory.
-   Inventory quantity cannot become negative.
-   Gold cannot become negative.
-   Rod purchases require sufficient Gold.
-   Only one rod can be equipped at a time.

------------------------------------------------------------------------

# 9. Database Requirements

The application uses **Supabase PostgreSQL**.

Custom tables:

1.  profiles
2.  fish_species
3.  inventory
4.  catches
5.  rods
6.  transactions

## Relationships

### profiles

-   One-to-One with Auth.js User
-   One-to-Many with inventory
-   One-to-Many with catches
-   One-to-Many with transactions

### fish_species

-   One-to-Many with inventory
-   One-to-Many with catches

### inventory

-   Many-to-One with profiles
-   Many-to-One with fish_species

### catches

-   Many-to-One with profiles
-   Many-to-One with fish_species

### rods

-   One-to-Many with profiles

### transactions

-   Many-to-One with profiles

## Foreign Keys

-   profiles.user_id → auth.users.id
-   profiles.equipped_rod_id → rods.id
-   inventory.profile_id → profiles.id
-   inventory.fish_species_id → fish_species.id
-   catches.profile_id → profiles.id
-   catches.fish_species_id → fish_species.id
-   transactions.profile_id → profiles.id
-   transactions.fish_species_id → fish_species.id

All relationships must enforce referential integrity.

------------------------------------------------------------------------

# 10. Technical Stack

Frontend

-   Next.js 15
-   TypeScript
-   Tailwind CSS
-   DaisyUI

Authentication

-   Auth.js
-   GitHub OAuth

Backend

-   Server Actions
-   Route Handlers

Database

-   Supabase PostgreSQL

Storage

-   Supabase Storage

Deployment

-   GitHub
-   Vercel

------------------------------------------------------------------------

# 11. Deployment Requirements

The project must:

-   Build successfully
-   Be pushed to GitHub
-   Deploy successfully on Vercel
-   Run without runtime errors
-   Include a README.md
-   Include an .env.example

------------------------------------------------------------------------

# 12. Nice-to-Have Features

-   Dark Mode
-   Skeleton Loading
-   Error Boundary
-   Responsive Design
-   Supabase Realtime Leaderboard

------------------------------------------------------------------------

# 13. Out of Scope

The MVP does **not** include:

-   Multiplayer
-   PvP
-   Guilds
-   Chat
-   Quests
-   Achievements
-   Daily Rewards
-   Weather System
-   Fishing Animations
-   Crafting
-   Trading
-   Mini Games
-   Energy System

------------------------------------------------------------------------

# 14. Definition of Done

The project is considered complete when:

-   GitHub login works
-   Logout works
-   RBAC is fully enforced
-   Middleware protects routes
-   API/Server Actions validate roles
-   Fishing system works
-   Random fish generation works
-   Inventory updates correctly
-   Fish selling works
-   Rod purchasing works
-   Rod equipping works
-   Gold updates correctly
-   All gameplay data is linked to authenticated users
-   Supabase PostgreSQL is used
-   At least five custom tables exist
-   Supabase Storage is implemented
-   The repository is available on GitHub
-   The application is deployed on Vercel
-   The Production URL is fully functional
-   The project is ready for Viva examination
