# Business Listing MERN App

![App screenshot](docs/screenshot.png)

Minimal business directory built with the MERN stack. Visitors can browse and filter listings, while authenticated users manage their own businesses and bookmarks. Admins can review platform statistics and seed data is provided for quick demos.

## Features

- **Search & filters**: text search, category, city, area, and sort controls with pagination.
- **Suggested locations**: sticky sidebar with quick filters from seeded locations.
- **Listing management**: owners (or admins) can create, edit, and delete listings with validation.
- **Bookmarks**: users can bookmark/unbookmark listings and review them in a dedicated page.
- **Authentication**: JWT stored in httpOnly cookies with protected routes and role guards.
- **Admin tools**: seed script for sample data and `/admin/stats` endpoint + UI for user/listing counts.
- **Secure defaults**: rate limiting, helmet, CORS restrictions, centralized error handling.
- **Testing & linting**: Jest + Supertest for API, Vitest for UI, ESLint + Prettier for consistent code style.

## Tech Stack

- **Backend**: Node.js 20, Express 4, MongoDB with Mongoose, Zod validation.
- **Frontend**: React 18 (Vite), Tailwind CSS, React Router.
- **Auth**: JWT with httpOnly cookies, role-based guards.
- **Tooling**: ESLint, Prettier, Vitest, Jest, Supertest, mongodb-memory-server.

## Prerequisites

- Node.js 20+
- npm 10+
- Local MongoDB instance at `mongodb://127.0.0.1:27017` (or update `.env`)

## Project Structure

```
.
├── client/                 # Vite + React frontend
├── server/                 # Express API (MVC)
├── docs/screenshot.png     # Placeholder UI screenshot
└── README.md
```

## Setup

1. **Install dependencies**
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
2. **Configure environments**
   - Copy `server/.env.example` → `server/.env`
   - Copy `client/.env.example` → `client/.env`
   - Adjust values as needed (`MONGO_URI`, `JWT_SECRET`, `CORS_ORIGIN`, `COOKIE_NAME`, `VITE_API_BASE_URL`)

3. **Seed database (optional)**
   ```bash
   cd server
   npm run seed
   ```
   Seed creates:
   - Admin: `admin@example.com / admin123`
   - Users: `jane@example.com`, `john@example.com` (password `user123`)
   - Categories, locations, and 20 listings

## Running the apps

Open two terminals:

```bash
# Terminal 1 – API
cd server
npm run dev

# Terminal 2 – Frontend
cd client
npm run dev
```

Frontend defaults to http://localhost:5173 and proxies API requests to http://localhost:4000.

## Scripts

| Location | Command            | Description                          |
|----------|--------------------|--------------------------------------|
| server   | `npm run dev`      | Start API with nodemon               |
| server   | `npm run test`     | Run Jest + Supertest suite           |
| server   | `npm run lint`     | Lint backend source files            |
| server   | `npm run seed`     | Seed MongoDB with demo data          |
| client   | `npm run dev`      | Start Vite dev server                |
| client   | `npm run build`    | Build production assets              |
| client   | `npm run preview`  | Preview production build             |
| client   | `npm run test`     | Run Vitest component tests           |
| client   | `npm run lint`     | Lint frontend source files           |

## API Reference

- Base URL: `http://localhost:4000/api`
- Postman collection & environment: `server/collections/`
- Key routes:
  - `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`
  - `GET /listings`, `GET /listings/:id`, `POST /listings`, `PUT /listings/:id`, `DELETE /listings/:id`
  - `GET /users/me`, `GET /users/me/bookmarks`, `POST /users/me/bookmarks/:listingId`
  - `GET /meta/categories`, `GET /meta/locations`
  - `GET /admin/stats` (admin only)

All responses follow `{ success, data, error }` structure and controllers delegate logic to service classes to maintain MVC separation.

## Testing

```bash
# Backend (Jest)
cd server
npm test

# Frontend (Vitest)
cd client
npm test
```

## Linting & Formatting

Prettier config is shared at the repo root.

```bash
cd server && npm run lint
cd client && npm run lint
```

## Notes

- Auth and listing mutation routes are rate-limited.
- Validation uses Zod schemas in the backend.
- Suggested locations panel on the frontend uses seeded location data; clicking applies filters immediately.
- Admin stats page (`/admin/stats`) is visible only to users with the `admin` role.

Enjoy building with the Business Listing MVP! Contributions and improvements are welcome.
