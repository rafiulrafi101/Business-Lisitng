# Quick Start Guide

Get BizList running in under 5 minutes!

## Prerequisites Check

```bash
node --version  # Should be 20 or higher
mongod --version  # MongoDB should be installed
```

## Fast Setup

```bash
# 1. Start MongoDB (choose one)
mongod
# OR with Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 2. Install Backend Dependencies
cd server
npm install

# 3. Setup Backend Environment
# The .env file is already created with defaults
# Edit server/.env if you need different settings

# 4. Seed Database
npm run seed

# 5. Start Backend (in one terminal)
npm run dev

# Backend now running at http://localhost:5000

# 6. Install Frontend Dependencies (in another terminal)
cd ../client
npm install

# 7. Start Frontend
npm run dev

# Frontend now running at http://localhost:5173
```

## Test Login Credentials

After seeding, you can login with:

- **Admin**: admin@example.com / admin123
- **User 1**: john@example.com / password123
- **User 2**: jane@example.com / password123

## Verify Installation

1. Open http://localhost:5173
2. Click "Browse" to see listings
3. Click "Login" and use credentials above
4. Try creating a new listing

## Run Tests

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## Common Issues

**Port 5000 already in use?**
```bash
# Change PORT in server/.env to 5001
# Update VITE_API_URL in client/.env to http://localhost:5001/api
```

**MongoDB connection failed?**
```bash
# Make sure MongoDB is running
sudo systemctl start mongod
# OR
docker start mongodb
```

**CORS errors?**
- Ensure CORS_ORIGIN in server/.env matches your frontend URL (default: http://localhost:5173)

## What's Next?

- Browse the full [README.md](./README.md) for detailed documentation
- Import [postman_collection.json](./postman_collection.json) to test the API
- Check the code structure in server/src and client/src

## Project Highlights

✅ **Backend**: Strict MVC architecture with service layer  
✅ **Frontend**: React with Tailwind CSS and React Router  
✅ **Auth**: JWT with httpOnly cookies  
✅ **Testing**: Jest (backend) and Vitest (frontend)  
✅ **Validation**: express-validator on all endpoints  
✅ **Security**: Rate limiting, helmet, CORS  
✅ **Data**: 20+ seeded listings across 5 categories  

Enjoy building with BizList! 🚀
