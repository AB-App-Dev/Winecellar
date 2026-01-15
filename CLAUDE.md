# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server on http://localhost:3000

# Build & Preview
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run generate     # Generate static site

# Database (Prisma)
npx prisma generate  # Generate Prisma client (outputs to app/generated/prisma)
npx prisma migrate dev --name <name>  # Create and apply migration
npx prisma db push   # Push schema changes without migration
npx prisma studio    # Open Prisma Studio GUI
```

## Architecture

**WineCellar** is a Nuxt 4 wine card application with two sections:
- **Guest Section**: Public browsing, filtering, and favoriting wines
- **Admin Section**: Protected area for managing wines, wineries, and suppliers (CRUD + dashboard)

### Tech Stack
- **Nuxt 4** with Vue 3
- **Pinia** for state management
- **Prisma** with PostgreSQL for database
- **TypeScript** throughout

### Coding Standards
- **ALWAYS use Composition API with `<script setup>`** - No exceptions. Never use Options API.

### Project Structure (Nuxt conventions)
- `app/` - Main application code (Nuxt 4 default)
- `prisma/schema.prisma` - Database schema (client generates to `app/generated/prisma`)
- `.env` - Environment variables (includes `DATABASE_URL`)

### Data Model (from winecellar_specs.md)
- **Wine**: Core entity with art, taste, year, price, grower relation, availability status
- **Wineries**: Wine producers (one-to-many with wines)
- **Supplier**: Independent supplier management
- **User**: Admin authentication (predefined accounts only, no registration)
- **Favorite**: Server-synced guest favorites using `guestKey` (anonymous identifier)

### Key Business Rules
- Wines with `hiddenForGuests=true` are admin-only
- Wines with future `availableAtYear` show as "coming soon" and cannot be favorited
- Guest default sort: price ascending
- Admin default sort: production year
- Guests identified by UUID `guestKey` (stored client-side, sent via `X-Guest-Key` header)
