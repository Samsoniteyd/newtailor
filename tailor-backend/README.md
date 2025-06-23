# Tailor Backend API

A comprehensive backend API for managing tailor services, customer requisitions, and measurements.

## Features

- User authentication (email/phone)
- Requisition management
- Measurement tracking
- JWT-based authentication
- Input validation
- Error handling
- Rate limiting
- Security middleware

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Joi validation
- bcryptjs

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the required environment variables (see `.env.example`)

4. Start the server:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `DELETE /api/auth/profile` - Delete user profile (protected)

### Requisitions
- `GET /api/requisitions` - Get all requisitions (protected)
- `GET /api/requisitions/:id` - Get specific requisition (protected)
- `POST /api/requisitions` - Create new requisition (protected)
- `PUT /api/requisitions/:id` - Update requisition (protected)
- `DELETE /api/requisitions/:id` - Delete requisition (protected)

### Health Check
- `GET /health` - Server health check

## Environment Variables

Create a `.env` file with the following variables:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGO_URI=mongodb://localhost:27017/tailor_db
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

## Project Structure
