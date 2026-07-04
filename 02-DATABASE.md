# 02-DATABASE.md

# Pixel Pond Database Design

**Database:** Supabase PostgreSQL\
**Version:** 1.0 (MVP)

------------------------------------------------------------------------

# Overview

The application uses **Supabase PostgreSQL** as the primary relational
database.

The schema follows database normalization principles and satisfies the
bootcamp requirements:

-   At least 5 custom tables
-   One-to-One relationships
-   One-to-Many relationships
-   Foreign Key constraints
-   Referential Integrity

------------------------------------------------------------------------

# Database Schema

## auth.users

Managed by Auth.js / Supabase Authentication.

This table is **not** part of the custom schema.

------------------------------------------------------------------------

## profiles

Stores player information.

### Columns

  Column            Type          Description
  ----------------- ------------- --------------------------
  id                uuid (PK)     Profile ID
  user_id           uuid (FK)     References auth.users.id
  role              text          player / admin
  gold              integer       Current player gold
  equipped_rod_id   uuid (FK)     Equipped rod
  created_at        timestamptz   Created timestamp
  updated_at        timestamptz   Updated timestamp

### Relationships

-   One-to-One → auth.users
-   One-to-Many → inventory
-   One-to-Many → catches
-   One-to-Many → transactions
-   One-to-Many → player_rods

------------------------------------------------------------------------

## fish_species

Master table containing every fish in the game.

### Columns

  Column       Type
  ------------ -------------
  id           uuid (PK)
  name         text
  rarity       text
  drop_rate    numeric
  sell_price   integer
  image_url    text
  created_at   timestamptz

### Relationships

-   One-to-Many → inventory
-   One-to-Many → catches

------------------------------------------------------------------------

## inventory

Stores the current fish owned by each player.

### Columns

  Column            Type
  ----------------- -----------
  id                uuid (PK)
  profile_id        uuid (FK)
  fish_species_id   uuid (FK)
  quantity          integer

### Constraints

-   UNIQUE(profile_id, fish_species_id)
-   quantity \>= 0

### Relationships

-   Many-to-One → profiles
-   Many-to-One → fish_species

------------------------------------------------------------------------

## catches

Stores every fishing attempt.

### Columns

  Column            Type
  ----------------- -------------
  id                uuid (PK)
  profile_id        uuid (FK)
  fish_species_id   uuid (FK)
  caught_at         timestamptz

### Relationships

-   Many-to-One → profiles
-   Many-to-One → fish_species

------------------------------------------------------------------------

## rods

Master table for fishing rods.

### Columns

  Column       Type
  ------------ -----------
  id           uuid (PK)
  name         text
  price        integer
  luck_bonus   integer
  image_url    text

### Relationships

-   One-to-Many → player_rods
-   One-to-Many → profiles (equipped rod)

------------------------------------------------------------------------

## player_rods

Stores every rod owned by a player.

### Columns

  Column         Type
  -------------- -------------
  id             uuid (PK)
  profile_id     uuid (FK)
  rod_id         uuid (FK)
  purchased_at   timestamptz

### Constraints

-   UNIQUE(profile_id, rod_id)

### Relationships

-   Many-to-One → profiles
-   Many-to-One → rods

------------------------------------------------------------------------

## transactions

Stores fish selling history.

### Columns

  Column            Type
  ----------------- -------------
  id                uuid (PK)
  profile_id        uuid (FK)
  fish_species_id   uuid (FK)
  quantity          integer
  total_gold        integer
  created_at        timestamptz

### Relationships

-   Many-to-One → profiles
-   Many-to-One → fish_species

------------------------------------------------------------------------

# Entity Relationship Diagram

``` text
auth.users
    │
    │ 1 : 1
    ▼
profiles
├──────────────┐
│              │
│1:N           │1:N
▼              ▼
inventory    catches
│              │
│N:1           │N:1
▼              ▼
fish_species  fish_species

profiles
│
│1:N
▼
transactions
│
└──────────────► fish_species

profiles
│
│1:N
▼
player_rods
│
│N:1
▼
rods

profiles.equipped_rod_id
        │
        ▼
       rods
```

------------------------------------------------------------------------

# Foreign Keys

  Source                         Target
  ------------------------------ -----------------
  profiles.user_id               auth.users.id
  profiles.equipped_rod_id       rods.id
  inventory.profile_id           profiles.id
  inventory.fish_species_id      fish_species.id
  catches.profile_id             profiles.id
  catches.fish_species_id        fish_species.id
  player_rods.profile_id         profiles.id
  player_rods.rod_id             rods.id
  transactions.profile_id        profiles.id
  transactions.fish_species_id   fish_species.id

------------------------------------------------------------------------

# Business Constraints

-   One authenticated user owns exactly one profile.
-   A profile may own many fish.
-   A profile may own many rods.
-   Only one rod may be equipped at a time.
-   Every fishing action creates one catch record.
-   Fish quantity cannot be negative.
-   Gold cannot be negative.
-   Selling fish creates a transaction record.
-   Inventory records are unique per player and fish species.

------------------------------------------------------------------------

# Initial Seed Data

## Fish

-   10--15 fish species
-   4 rarity levels
-   Total drop rate = 100%

## Rods

-   Wooden Rod (Starter)
-   Bamboo Rod
-   Iron Rod
-   Golden Rod

## Default Player

-   Role: player
-   Starting Gold: 100
-   Equipped Rod: Wooden Rod

------------------------------------------------------------------------

# Notes

-   UUID is used as the primary key for every custom table.
-   All timestamps use `timestamptz`.
-   All relationships are enforced using Foreign Keys.
-   The schema is designed for scalability while remaining simple enough
    for a bootcamp MVP.
