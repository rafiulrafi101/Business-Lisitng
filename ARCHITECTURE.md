# Architecture Documentation

## Overview

BizList follows a strict **Model-View-Controller (MVC)** architecture on the backend with a clear separation of concerns through a dedicated **Service Layer**. The frontend uses a **Component-Based Architecture** with React.

## Backend Architecture

### Layered Architecture

```
┌─────────────────────────────────────┐
│          HTTP Request               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Routes Layer                │
│  - Route definitions                │
│  - Input validation (express-val)   │
│  - Rate limiting                    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Controllers Layer             │
│  - Request/Response handling        │
│  - Calls services                   │
│  - Thin, no business logic          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Services Layer               │
│  - Business logic                   │
│  - Data processing                  │
│  - Calls models                     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Models Layer                │
│  - Mongoose schemas                 │
│  - Data validation                  │
│  - Database operations              │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│           MongoDB                   │
└─────────────────────────────────────┘
```

### Directory Structure

```
server/src/
├── config/           # Configuration files (DB, env)
├── models/           # Mongoose schemas (data layer)
├── services/         # Business logic layer
├── controllers/      # Request handlers (thin layer)
├── routes/           # Route definitions + validation
├── middlewares/      # Custom middleware (auth, errors)
├── utils/            # Helper functions
└── scripts/          # Utility scripts (seed)
```

### Key Principles

1. **Controllers are thin**: Only handle HTTP requests/responses
2. **Services contain logic**: All business rules live here
3. **Models define data**: Schema validation and DB operations
4. **Middleware handles cross-cutting concerns**: Auth, validation, errors

### Example Flow: Create Listing

```javascript
// 1. Route (listing.routes.js)
router.post('/', protect, listingWriteLimiter, [
  body('name').trim().notEmpty(),
  // ... validation rules
], validate, listingController.createListing);

// 2. Controller (listing.controller.js)
createListing: asyncHandler(async (req, res) => {
  const listing = await listingService.createListing(req.user._id, req.body);
  res.status(201).json({ success: true, data: listing });
}),

// 3. Service (listing.service.js)
async createListing(userId, listingData) {
  const listing = await Listing.create({
    ...listingData,
    owner: userId,
  });
  return listing;
},

// 4. Model (Listing.js)
const listingSchema = new mongoose.Schema({
  owner: { type: ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  // ... schema definition
});
```

## Frontend Architecture

### Component Hierarchy

```
App
├── AuthProvider (Context)
│   ├── Header
│   ├── Routes
│   │   ├── Home
│   │   ├── Listings
│   │   │   ├── FilterBar
│   │   │   ├── ListingCard (repeated)
│   │   │   ├── SuggestedLocationsPanel
│   │   │   └── Pagination
│   │   ├── ListingDetail
│   │   ├── Login
│   │   ├── Register
│   │   ├── Profile
│   │   ├── Bookmarks
│   │   ├── NewListing
│   │   ├── EditListing
│   │   └── NotFound
│   └── Footer
```

### State Management

- **Authentication**: React Context (`AuthContext`)
- **Component State**: React hooks (`useState`, `useEffect`)
- **No global state library**: Kept simple for this scale

### Data Flow

```
Component → API Client → Backend API → Response → Component State
```

Example:
```javascript
// 1. Component calls API
const loadListings = async () => {
  const response = await listingAPI.getListings(filters);
  setListings(response.data.listings);
};

// 2. API client handles fetch
export const listingAPI = {
  getListings: (params) => {
    const query = new URLSearchParams(params);
    return fetchWithCredentials(`/listings?${query}`);
  }
};

// 3. fetchWithCredentials adds auth
const fetchWithCredentials = async (url, options = {}) => {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: 'include', // httpOnly cookies
    headers: { 'Content-Type': 'application/json' }
  });
  return handleResponse(response);
};
```

## Data Models

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  passwordHash: String (hidden),
  role: 'user' | 'admin',
  createdAt: Date,
  updatedAt: Date
}
```

### Listing
```javascript
{
  _id: ObjectId,
  owner: ObjectId (ref: User, indexed),
  name: String (text index),
  category: Enum (indexed),
  location: {
    city: String (indexed),
    area: String (indexed)
  },
  shortDescription: String,
  description: String,
  phone: String,
  hours: String,
  imageUrl: String,
  isActive: Boolean (indexed),
  createdAt: Date (indexed),
  updatedAt: Date
}

// Compound indexes:
// { category: 1, 'location.city': 1 }
// { isActive: 1, createdAt: -1 }
```

### Bookmark
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, indexed),
  listing: ObjectId (ref: Listing, indexed),
  createdAt: Date
}

// Unique compound index:
// { user: 1, listing: 1 }
```

### Category
```javascript
{
  _id: ObjectId,
  key: String (unique),
  label: String
}
```

### Location
```javascript
{
  _id: ObjectId,
  city: String,
  area: String
}

// Unique compound index:
// { city: 1, area: 1 }
```

## Security Architecture

### Authentication Flow

```
1. User submits credentials → Backend validates
2. Backend creates JWT → Sets httpOnly cookie
3. Frontend makes requests → Cookie auto-sent
4. Backend validates JWT → Proceeds or rejects
5. User logs out → Backend clears cookie
```

### Security Layers

1. **Helmet.js**: Sets security headers
2. **CORS**: Restricts origins
3. **Rate Limiting**: Prevents abuse
   - Auth endpoints: 10 requests / 15min
   - Write endpoints: 30 requests / 15min
4. **Input Validation**: express-validator on all inputs
5. **Password Hashing**: bcryptjs with salt
6. **JWT**: Signed tokens with expiry
7. **httpOnly Cookies**: Prevents XSS attacks

## API Response Format

### Success Response
```javascript
{
  success: true,
  data: { ... } // or [ ... ]
}
```

### Error Response
```javascript
{
  success: false,
  error: "Error message"
  // stack: "..." (only in development)
}
```

### Paginated Response
```javascript
{
  success: true,
  data: {
    listings: [ ... ],
    pagination: {
      page: 1,
      limit: 12,
      total: 50,
      pages: 5
    }
  }
}
```

## Database Indexes

Strategically placed indexes for query performance:

1. **User.email**: Unique index for login lookups
2. **Listing.name**: Text index for search
3. **Listing.category**: Single index for filtering
4. **Listing.owner**: Single index for user's listings
5. **Listing.isActive**: Single index for active filtering
6. **Listing (category + city)**: Compound index for common query
7. **Listing (isActive + createdAt)**: Compound index for sorting
8. **Bookmark (user + listing)**: Unique compound index

## Error Handling

### Backend
```javascript
// Custom ApiError class
throw new ApiError(404, 'Resource not found');

// Centralized error handler
app.use(errorHandler);

// AsyncHandler wrapper
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

### Frontend
```javascript
try {
  const response = await api.call();
  // handle success
} catch (err) {
  setError(err.message); // Display to user
}
```

## Testing Strategy

### Backend Tests (Jest)
- **Unit Tests**: Service layer functions
- **Integration Tests**: Controllers with mocked services
- **Mock Strategy**: Mock external dependencies (DB, services)

### Frontend Tests (Vitest)
- **Component Tests**: Render and interaction tests
- **Testing Library**: User-centric testing approach
- **Mock Strategy**: Mock API calls and context

## Performance Considerations

1. **Database Indexes**: Optimized for common queries
2. **Pagination**: Limit results per page
3. **Lean Queries**: Use `.lean()` for read-only data
4. **Parallel Queries**: Use `Promise.all()` where possible
5. **Rate Limiting**: Prevent resource exhaustion
6. **Image URLs**: External URLs (no upload processing)

## Scalability Considerations

Current architecture supports:
- Horizontal scaling (stateless API with JWT)
- Database replication (MongoDB replica sets)
- Caching layer (Redis, not implemented)
- Load balancing (multiple API instances)

Future enhancements:
- Redis for session management
- Elasticsearch for advanced search
- CDN for static assets
- Message queue for async tasks

## Development Workflow

1. **Backend**: Create model → Service → Controller → Route
2. **Frontend**: Design page → Create components → Connect API → Test
3. **Testing**: Write tests alongside features
4. **Documentation**: Update README and ARCHITECTURE.md

## Code Quality

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Git**: Version control
- **Environment Variables**: Secrets management
- **Error Handling**: Consistent error responses
- **Validation**: Input validation on all endpoints

---

This architecture ensures:
- ✅ Separation of concerns
- ✅ Testability
- ✅ Maintainability
- ✅ Scalability
- ✅ Security
