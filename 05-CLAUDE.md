# 05-CLAUDE.md

# Claude Development Guide

Project: Pixel Pond Version: 1.0 (MVP)

------------------------------------------------------------------------

# Purpose

This document defines the development rules for AI-assisted coding.

Claude must strictly follow this document together with:

-   01-PRD.md
-   02-DATABASE.md
-   03-ARCHITECTURE.md
-   04-UI.md

Do not introduce features outside the MVP scope.

------------------------------------------------------------------------

# Primary Goal

Build a production-ready Full Stack web application that satisfies the
bootcamp requirements.

Priorities:

1.  Correctness
2.  Simplicity
3.  Readability
4.  Maintainability

------------------------------------------------------------------------

# Technology Stack

Framework

-   Next.js 15 (App Router)

Language

-   TypeScript (strict mode)

Authentication

-   Auth.js
-   GitHub OAuth

Database

-   Supabase PostgreSQL

Storage

-   Supabase Storage

Styling

-   Tailwind CSS
-   DaisyUI

Deployment

-   GitHub
-   Vercel

------------------------------------------------------------------------

# Coding Rules

-   Use TypeScript only.
-   Do not use JavaScript files.
-   Avoid the `any` type.
-   Prefer async/await.
-   Keep functions small and focused.
-   Prefer composition over duplication.
-   Write readable code over clever code.

------------------------------------------------------------------------

# Project Structure

Follow the architecture document exactly.

Do not create unnecessary folders.

Keep the project simple.

------------------------------------------------------------------------

# Data Access

Supabase is the only database.

Never store game data in localStorage.

All persistent data must come from Supabase.

------------------------------------------------------------------------

# Authentication

Use Auth.js.

GitHub OAuth is the only authentication provider.

Every protected action requires an authenticated session.

------------------------------------------------------------------------

# Authorization

Roles:

-   player
-   admin

Middleware must protect private routes.

Server Actions must validate user roles before database operations.

Never trust client-side authorization.

------------------------------------------------------------------------

# Server Actions

Prefer Server Actions over API Routes.

Use API Routes only when Server Actions are not suitable.

Business logic belongs in Server Actions.

------------------------------------------------------------------------

# UI Rules

Follow 04-UI.md.

Use:

-   Responsive layouts
-   Reusable components
-   DaisyUI components
-   Tailwind utilities

Maintain consistent spacing, typography and colors.

------------------------------------------------------------------------

# Assets

Load all assets from:

/public/assets

Use next/image for every image.

Do not use placeholder graphics if project assets exist.

------------------------------------------------------------------------

# Database Rules

Follow 02-DATABASE.md exactly.

Never modify the schema without updating documentation.

Always use Foreign Keys.

Use UUID for all custom tables.

------------------------------------------------------------------------

# Error Handling

Handle expected failures.

Display user-friendly error messages.

Never expose internal errors to users.

------------------------------------------------------------------------

# Performance

-   Minimize unnecessary re-renders.
-   Optimize images.
-   Lazy load when appropriate.
-   Keep pages responsive.

------------------------------------------------------------------------

# Code Quality

-   Reuse components.
-   Remove dead code.
-   Use meaningful names.
-   Keep files organized.
-   Prefer simple solutions.

------------------------------------------------------------------------

# Git Rules

Write small, meaningful commits.

Example:

-   feat: add fishing system
-   feat: implement inventory
-   fix: correct gold calculation
-   refactor: simplify fishing logic

------------------------------------------------------------------------

# Out of Scope

Do NOT implement:

-   Multiplayer
-   PvP
-   Guilds
-   Chat
-   Crafting
-   Trading
-   Daily Rewards
-   Quests
-   Achievements
-   Weather System
-   Energy System

------------------------------------------------------------------------

# Definition of Success

Claude should generate a project that:

-   Matches all documentation
-   Uses Supabase correctly
-   Uses Auth.js correctly
-   Implements RBAC
-   Is deployable to Vercel
-   Builds without runtime errors
-   Remains within MVP scope
-   Produces clean, understandable code suitable for a bootcamp Viva
