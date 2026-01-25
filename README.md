# WineCellar

An interactive wine card application built with Nuxt 4 for managing and displaying wine collections. Features a public guest section for browsing wines and a protected admin area for inventory management.

## Features

### Guest Section (Public)
- Browse wines with detailed information (name, winery, year, taste, type, price, etc.)
- Filter wines by type (red, white, rose, etc.), country, and taste
- Mark/unmark wines as favorites (persisted server-side via anonymous guest key)
- Switch between grid and list layouts
- Light/Dark/System theme support
- "Coming Soon" wines displayed with availability year (not favoritable)

### Admin Section (Protected)
- **Dashboard**: Overview statistics with charts for wines by type, taste, and country
- **Wines**: Full CRUD operations with image upload support
- **Wineries**: Manage wine producers/growers
- **Suppliers**: Manage wine suppliers
- Protected Swagger UI and OpenAPI documentation

## Tech Stack

### Core Framework
- **[Nuxt 4](https://nuxt.com/)** - Vue.js meta-framework with server-side rendering
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework (Composition API with `<script setup>`)
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### UI & Styling
- **[Nuxt UI v4](https://ui.nuxt.com/)** - Component library built on Tailwind CSS
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide Icons](https://lucide.dev/)** - Icon library

### State Management
- **[Pinia](https://pinia.vuejs.org/)** - Vue.js store library
- **[@pinia/nuxt](https://pinia.vuejs.org/ssr/nuxt.html)** - Nuxt integration for Pinia

### Database & ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM for Node.js & TypeScript
- **[@prisma/adapter-pg](https://www.prisma.io/docs/orm/overview/databases/postgresql)** - PostgreSQL adapter for Prisma

### Authentication
- **[Better Auth](https://www.better-auth.com/)** - Authentication library for TypeScript
  - Email/password authentication
  - Session management with cookie caching
  - Prisma adapter for user storage
  - No self-registration (predefined admin accounts only)

### API Documentation
- **Nitro OpenAPI** - Auto-generated API documentation
  - Swagger UI at `/_swagger` (auth protected)
  - OpenAPI JSON at `/_openapi.json` (auth protected)

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm, pnpm, yarn, or bun

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/winecellar"
BETTER_AUTH_SECRET="your-secret-key"
```

### 3. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Apply migrations
npx prisma migrate dev

# (Optional) Seed with sample data
npm run db:seed

# (Optional) Open Prisma Studio GUI
npx prisma studio
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run generate` | Generate static site |
| `npm run db:seed` | Seed database with sample data |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma migrate dev --name <name>` | Create and apply migration |
| `npx prisma db push` | Push schema changes without migration |
| `npx prisma studio` | Open Prisma Studio GUI |

## Project Structure

```
Winecellar/
├── app/
│   ├── components/        # Vue components
│   │   └── admin/
│   │       └── modals/    # Admin modal dialogs
│   ├── layouts/           # Page layouts (default, admin)
│   ├── pages/             # File-based routing
│   │   ├── admin/         # Admin pages (protected)
│   │   └── index.vue      # Guest startpage
│   ├── stores/            # Pinia stores
│   ├── utils/             # Utility functions
│   └── generated/
│       └── prisma/        # Generated Prisma client
├── server/
│   ├── api/               # API routes
│   │   ├── admin/         # Admin API endpoints
│   │   ├── favorites/     # Guest favorites endpoints
│   │   ├── guest/         # Guest API endpoints
│   │   ├── stats/         # Statistics endpoints
│   │   └── upload/        # File upload endpoints
│   ├── middleware/        # Server middleware
│   └── utils/             # Server utilities (auth, prisma)
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding script
├── public/
│   └── uploads/           # Uploaded images
└── docs/                  # Project documentation
```

## Data Model

### Wine
Core entity with fields: name, type (art), taste, year, price, winery relation, availability status, guest visibility flag, and more.

### Winery (WineGrower)
Wine producers with contact information. One-to-many relationship with wines.

### Supplier
Independent supplier management with contact information.

### User
Admin authentication (predefined accounts only, no registration).

### Favorite
Server-synced guest favorites using anonymous `guestKey` identifier.

## API Endpoints

### Guest Endpoints
- `GET /api/guest/wines` - Get wines visible to guests (filtered, sorted by price)
- `GET /api/favorites` - Get guest's favorite wines
- `POST /api/favorites` - Add wine to favorites
- `DELETE /api/favorites/:wineId` - Remove wine from favorites

### Admin Endpoints
- `GET/POST /api/admin/wines` - List/Create wines
- `GET/PUT/DELETE /api/admin/wines/:id` - Read/Update/Delete wine
- `GET/POST /api/admin/wineries` - List/Create wineries
- `GET/PUT/DELETE /api/admin/wineries/:id` - Read/Update/Delete winery
- `GET/POST /api/admin/suppliers` - List/Create suppliers
- `GET/PUT/DELETE /api/admin/suppliers/:id` - Read/Update/Delete supplier

### Other Endpoints
- `GET /api/stats/wines` - Wine statistics (by type, taste, country)
- `POST /api/upload/image` - Upload wine image (max 5MB)
- `POST /api/auth/*` - Better Auth authentication endpoints

## Authentication

The app uses [Better Auth](https://www.better-auth.com/) for authentication:

- Session-based authentication with secure cookies
- 7-day session expiration with daily refresh
- Cookie caching for performance (5-minute TTL)
- Admin-only access (no public registration)

Guest identification uses a UUID `guestKey` stored client-side and sent via `X-Guest-Key` header for favorites functionality.

## License

Private project - All rights reserved.
