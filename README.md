# BizList - Business Listing Application

A full-stack MERN (MongoDB, Express, React, Node.js) business directory application that allows users to browse, search, and manage local business listings.

![BizList](https://via.placeholder.com/800x400?text=BizList+Business+Directory)

## Features

### Core Features
- 🔍 **Browse & Search** - Search businesses by name, category, and location with advanced filtering
- 📍 **Location-Based** - Suggested locations panel for easy filtering
- 🔐 **Authentication** - Secure JWT-based auth with httpOnly cookies
- ✏️ **Manage Listings** - Create, edit, and delete your own business listings
- ⭐ **Bookmarks** - Save and manage your favorite businesses
- 📱 **Responsive Design** - Mobile-first UI with Tailwind CSS
- 🔒 **Role-Based Access** - User and admin roles with protected routes
- ⚡ **Rate Limiting** - Protection against abuse on auth and write operations

### Technical Highlights
- Strict MVC architecture on the backend
- Service layer for business logic separation
- Input validation with express-validator
- Centralized error handling
- Pagination and sorting
- MongoDB indexes for performance
- React Context for state management
- Component testing with Vitest
- ESLint + Prettier for code quality

## Tech Stack

**Backend:**
- Node.js 20+
- Express 4+
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation
- express-rate-limit for rate limiting
- helmet & cors for security

**Frontend:**
- React 18+
- Vite for build tooling
- React Router for navigation
- Tailwind CSS for styling
- Vitest + Testing Library for tests

## Prerequisites

- Node.js 20 or higher
- MongoDB (local installation or Docker)
- npm or yarn

## Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd business-listing
```

### 2. Backend Setup

```bash
cd server
npm install

# Create .env file
cp .env.example .env
```

Edit `server/.env` with your configuration:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/business-listing
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
COOKIE_NAME=auth_token
CORS_ORIGIN=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd ../client
npm install

# Create .env file
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Seed the Database

```bash
cd server
npm run seed
```

This will create:
- Admin user: `admin@example.com` / `admin123`
- Test user 1: `john@example.com` / `password123`
- Test user 2: `jane@example.com` / `password123`
- 5 categories (Haircut, Laundry, Electronics, Fashion, Market)
- 10 locations across multiple cities
- 20+ sample business listings

### 6. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server runs at http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Client runs at http://localhost:5173

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Logout
```http
POST /auth/logout
```

### Listing Endpoints

#### Get All Listings (Public)
```http
GET /listings?search=&category=&city=&area=&sort=newest&page=1&limit=12
```

Query Parameters:
- `search` - Text search in name/description
- `category` - Filter by category (Haircut, Laundry, Electronics, Fashion, Market)
- `city` - Filter by city
- `area` - Filter by area
- `sort` - Sort by `newest` or `az`
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

#### Get Single Listing (Public)
```http
GET /listings/:id
```

#### Get My Listings (Protected)
```http
GET /listings/my-listings
```

#### Create Listing (Protected)
```http
POST /listings
Content-Type: application/json

{
  "name": "Joe's Barbershop",
  "category": "Haircut",
  "location": {
    "city": "New York",
    "area": "Manhattan"
  },
  "shortDescription": "Classic haircuts for men",
  "description": "Full description here...",
  "phone": "(555) 123-4567",
  "hours": "Mon-Sat 9AM-7PM",
  "imageUrl": "https://example.com/image.jpg"
}
```

#### Update Listing (Protected - Owner/Admin)
```http
PUT /listings/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "shortDescription": "Updated description"
}
```

#### Delete Listing (Protected - Owner/Admin)
```http
DELETE /listings/:id
```

### User Endpoints

#### Get Current User (Protected)
```http
GET /users/me
```

#### Get My Bookmarks (Protected)
```http
GET /users/me/bookmarks
```

#### Toggle Bookmark (Protected)
```http
POST /users/me/bookmarks/:listingId
```

### Meta Endpoints

#### Get Categories (Public)
```http
GET /meta/categories
```

#### Get Locations (Public)
```http
GET /meta/locations
```

### Admin Endpoints

#### Get Stats (Admin Only)
```http
GET /admin/stats
```

Returns:
```json
{
  "success": true,
  "data": {
    "users": 10,
    "totalListings": 50,
    "activeListings": 48
  }
}
```

## Testing

### Backend Tests

```bash
cd server
npm test
```

Tests include:
- Listing service unit tests
- Listing controller tests
- Mock-based testing with Jest

### Frontend Tests

```bash
cd client
npm test
```

Tests include:
- ListingCard component test
- Render testing with Testing Library

## Project Structure

```
business-listing/
├── server/
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   │   ├── database.js
│   │   │   └── env.js
│   │   ├── models/           # Mongoose models
│   │   │   ├── User.js
│   │   │   ├── Listing.js
│   │   │   ├── Bookmark.js
│   │   │   ├── Category.js
│   │   │   └── Location.js
│   │   ├── services/         # Business logic layer
│   │   │   ├── auth.service.js
│   │   │   ├── listing.service.js
│   │   │   ├── user.service.js
│   │   │   ├── admin.service.js
│   │   │   └── meta.service.js
│   │   ├── controllers/      # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── listing.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── admin.controller.js
│   │   │   └── meta.controller.js
│   │   ├── routes/           # API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── listing.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── admin.routes.js
│   │   │   └── meta.routes.js
│   │   ├── middlewares/      # Custom middleware
│   │   │   ├── auth.js
│   │   │   ├── validate.js
│   │   │   ├── errorHandler.js
│   │   │   └── rateLimit.js
│   │   ├── utils/            # Utility functions
│   │   │   ├── ApiError.js
│   │   │   └── asyncHandler.js
│   │   ├── scripts/          # Utility scripts
│   │   │   └── seed.js
│   │   ├── app.js            # Express app
│   │   └── server.js         # Entry point
│   ├── test/                 # Tests
│   │   ├── services/
│   │   └── controllers/
│   ├── package.json
│   ├── .env.example
│   └── jest.config.js
│
├── client/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ListingCard.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── SuggestedLocationsPanel.jsx
│   │   │   ├── Pagination.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Listings.jsx
│   │   │   ├── ListingDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Bookmarks.jsx
│   │   │   ├── NewListing.jsx
│   │   │   ├── EditListing.jsx
│   │   │   └── NotFound.jsx
│   │   ├── lib/              # Utilities
│   │   │   ├── api.js
│   │   │   └── AuthContext.jsx
│   │   ├── test/             # Tests
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── vitest.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
└── README.md
```

## Scripts

### Server Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run seed` - Seed database with sample data
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Client Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Security Features

- 🔒 JWT authentication with httpOnly cookies
- 🛡️ Helmet.js for security headers
- 🔐 Password hashing with bcryptjs
- ⚡ Rate limiting on sensitive endpoints
- ✅ Input validation on all endpoints
- 🌐 CORS configuration
- 🚫 SQL injection prevention via Mongoose
- 🔑 Environment variable protection

## Design Decisions

### Backend Architecture
- **MVC Pattern**: Strict separation of concerns with Models, Views (JSON responses), and Controllers
- **Service Layer**: All business logic is in services, keeping controllers thin
- **Validation**: express-validator ensures data integrity
- **Error Handling**: Centralized error handler for consistent responses

### Frontend Architecture
- **Component-Based**: Reusable components for maintainability
- **Context API**: Simple global state for authentication
- **Fetch API**: Native fetch with credentials for cookie support
- **Mobile-First**: Responsive design from the ground up

## Future Enhancements (Out of Scope)

- Image upload to cloud storage (currently paste URL)
- Review and rating system
- Real-time features with WebSockets
- Email verification
- Social auth (Google, Facebook)
- Advanced analytics dashboard
- Map integration with geocoding
- Payment processing

## Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
mongod

# Or with Docker
docker start mongodb
```

### Port Already in Use
```bash
# Change PORT in server/.env
PORT=5001

# Change VITE_API_URL in client/.env accordingly
VITE_API_URL=http://localhost:5001/api
```

### CORS Issues
- Ensure CORS_ORIGIN in server/.env matches your frontend URL
- Default: `http://localhost:5173`

### Authentication Not Working
- Clear browser cookies
- Ensure JWT_SECRET is set in server/.env
- Check that cookies are enabled in your browser

## License

MIT

## Author

Built with ❤️ following MERN stack best practices

---

For questions or issues, please open an issue in the repository.
