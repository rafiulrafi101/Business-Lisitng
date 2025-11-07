## Business Listing

Minimal MERN application that lets locals discover, filter, and manage neighbourhood businesses. Authenticated users can publish their own listings, maintain bookmarks, and view a personalised dashboard, while administrators can review basic platform stats. The backend follows a strict MVC structure and exposes a clean REST API that the React frontend consumes.

![Home page](https://placehold.co/1200x640?text=Business+Listing+Home)

### Highlights

- **Tech stack:** Node.js 20 / Express 4, MongoDB + Mongoose, React 18 + Vite, JWT auth with httpOnly cookies.
- **Architecture:** Strict MVC separation (`models/`, `services/`, `controllers/`, `routes/`, `middlewares/`, `utils/`), zod validation, centralised error handling, and rate limiting on auth/write endpoints.
- **Features:** Full-text search & filters (category, city, area), suggested locations panel, paginated and sortable listings, listing detail pages, owner CRUD with validation, bookmarks, profile dashboard, admin stats endpoint, seed script, and Postman collection.
- **Tooling:** ESLint + Prettier, Jest + Supertest for backend, Vitest + Testing Library for frontend, `.env` driven configuration, and ready-to-run seeding script.

---

### Project Structure

```
business-listing/
├── client/               # React frontend (Vite)
│   ├── src/
│   │   ├── app/          # App shell + router
│   │   ├── components/   # Reusable UI and helpers
│   │   ├── pages/        # Route components
│   │   ├── state/        # Context providers
│   │   ├── lib/          # Fetch wrapper, helpers
│   │   └── styles/       # Global CSS
│   └── ...
├── server/               # Express backend
│   ├── src/
│   │   ├── config/       # Env + DB bootstrap
│   │   ├── models/       # Mongoose schemas
│   │   ├── services/     # Business logic
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # Route registration
│   │   ├── middlewares/  # Auth, validation, errors
│   │   └── utils/        # Helpers and response utils
│   ├── seed/             # Database seeding script
│   ├── test/             # Jest + Supertest suites
│   └── postman/          # Collection + environment
└── README.md
```

---

### Prerequisites

- Node.js **>= 20**
- npm **>= 10**
- MongoDB running locally (default URI: `mongodb://localhost:27017/business_listing`)

---

### Environment Variables

Copy each example file and adjust values as needed.

```
cp server/.env.example server/.env
cp client/.env.example client/.env
```

**Server `.env`**

| Variable      | Description                                   | Default                                       |
| ------------- | --------------------------------------------- | --------------------------------------------- |
| `PORT`        | API port                                      | `5000`                                        |
| `MONGO_URI`   | Mongo connection string                       | `mongodb://localhost:27017/business_listing`  |
| `JWT_SECRET`  | Secret used to sign JWT tokens                | `super-secret-key` (change in production)     |
| `CORS_ORIGIN` | Allowed frontend origin                       | `http://localhost:5173`                       |
| `COOKIE_NAME` | Name of the auth cookie                       | `bl_auth_token`                               |

**Client `.env`**

| Variable        | Description              | Default                      |
| --------------- | ------------------------ | ---------------------------- |
| `VITE_API_URL`  | Base API URL from React  | `http://localhost:5000/api`  |

---

### Installation

```bash
# clone the repo
git clone <repo-url> business-listing
cd business-listing

# install dependencies
npm install
npm --prefix server install
npm --prefix client install
```

---

### Running the App

```bash
# in one terminal (recommended)
npm run dev

# or in separate terminals
npm run server:dev
npm run client:dev
```

- API served at `http://localhost:5000/api`
- Frontend served at `http://localhost:5173`

---

### Database Seeding

Populate MongoDB with categories, suggested locations, sample users (including an admin), and 20+ listings.

```bash
npm run seed
```

- Default admin credentials: `admin@businesslisting.dev / admin123`
- Default user credentials: `jamie@example.com / password123`, `taylor@example.com / password123`

---

### Testing & Linting

```bash
# run backend + frontend tests
npm run test

# run linting for both apps
npm run lint

# run individual suites
npm --prefix server run test
npm --prefix client run test
npm --prefix server run lint
npm --prefix client run lint
```

Backend tests use Jest and `mongodb-memory-server`. Frontend tests use Vitest and Testing Library.

---

### API Collection

Import the provided Postman collection and environment:

- Collection: `server/postman/business-listing.postman_collection.json`
- Environment: `server/postman/business-listing.postman_environment.json`

Endpoints are grouped by feature (auth, listings, user, meta, admin) and assume cookies for auth.

---

### Key Implementation Notes

- **Auth:** JWT issued on login/registration, stored in httpOnly cookie. `requireAuth` middleware guards protected routes; `optionalAuth` hydrates user context for bookmark state.
- **Validation:** zod schemas validate request bodies, params, and queries through a reusable `validate` middleware.
- **Error handling:** Centralised middleware wraps responses in `{ success, data, error }` format and maps zod/mongoose validation errors.
- **Rate limiting:** Separate rate limiters for auth endpoints and listing write operations help mitigate abuse.
- **Indexes:** Unique constraints on users, bookmarks, categories, and compound indexes on listings (category + location, text search) keep queries fast.
- **Frontend state:** `AuthContext` manages the signed-in user lifecycle, `MetaContext` caches categories/locations, and a lightweight fetch wrapper handles credentials.
- **UX touches:** Filter bar, sticky suggested locations panel, pagination, profile dashboard (listing management), and bookmark flows.

---

### Suggested Next Steps

- Replace placeholder screenshot with real captures once the UI is running locally.
- Deploy API + client (e.g., Render/Heroku for the server, Netlify/Vercel for the client) and update `.env` + Postman environment accordingly.
- Add integration/e2e coverage (Playwright/Cypress) if the app grows.

Enjoy building with the Business Listing starter!
