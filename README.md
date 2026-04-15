# Book My Ticket

A modern, scalable movie ticket booking platform that enables users to browse movies, select multiple seats, and complete bookings with atomic transactions and real-time concurrency control.

## Overview

Book My Ticket is a full-stack web application designed to solve the common problem of movie ticket distribution in the digital age. The platform handles high-traffic scenarios where multiple users simultaneously attempt to book the same seats, ensuring data consistency and preventing double-bookings through row-level database locking.

### Problem Solved

Traditional movie booking systems struggle with:
- Race conditions when multiple users select the same seat simultaneously
- Inconsistent application state during high-traffic periods
- Poor user experience with slow, unresponsive interfaces
- Limited support for bulk seat selections

Book My Ticket addresses these issues with atomic multi-seat transactions and a responsive modern UI.

### Tech Stack

**Backend**
- Node.js with Express.js framework
- PostgreSQL for relational data management
- JWT authentication with token rotation
- Connection pooling for optimal database performance

**Frontend**
- Next.js 16 (React 19) with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- SWR for data fetching and caching
- Axios for HTTP requests

**DevOps & Tools**
- pnpm for package management
- ESLint for code quality
- node-pg-migrate for database migrations

## Project Structure

### Backend (src/)

Feature-based architecture with clear separation of concerns:

- **src/index.js**: HTTP server entry point
- **src/app/index.js**: Express application and global middleware setup
- **src/app/auth/**: Authentication module (controllers, services, routes, utilities)
- **src/app/booking/**: Movie and seat booking logic
- **src/app/middleware/**: Authentication, error handling, and rate limiting middleware
- **src/config/**: Environment variables and cookie configuration
- **src/db/**: Database connection pool and query utilities
- **src/utils/**: Shared utilities (ApiResponse, ApiError)
- **src/scripts/**: Database migration scripts
- **migrations/**: SQL migration files for schema management

### Frontend (Next.js)

Server-rendered React application with optimized performance:

- **app/**: Next.js App Router with page layouts
  - **app/page.tsx**: Landing page showing available movies
  - **app/booking/page.tsx**: Interactive multi-seat selection and booking
  - **app/signin/** & **app/signup/**: Authentication pages
- **components/**: Reusable React components
- **lib/**: Utility functions and API client
  - **lib/api.ts**: Centralized API communication layer
  - **lib/types.ts**: TypeScript type definitions
  - **lib/auth-storage.ts**: Client-side authentication state management
- **public/**: Static assets

## Multi-Seat Booking Logic

The system now supports booking multiple seats in a single atomic transaction, preventing partial bookings and ensuring consistency.

### Booking Flow

1. **User Selection**: Frontend collects an array of selected seat IDs
2. **Single Request**: Multiple seats are sent together in one API request with `seatIds: number[]`
3. **Atomic Transaction**:
   - Backend acquires connection from pool
   - Begins PostgreSQL transaction
   - Locks all requested seats with `FOR UPDATE` clause
   - Validates all seats are available
   - Updates all seats to booked status
   - Creates booking records for each seat
   - Commits transaction (all or nothing)
4. **Response**: Returns array of created booking records or error

### Technical Implementation

```
Backend Endpoint: POST /api/v1/booking/book
Request Body:
{
  "seatIds": [10, 11, 12],      // Array of seat IDs to book
  "username": "user@example.com",
  "showId": 1
}

Database Query (with row-level locking):
SELECT ss.seat_id FROM show_seats ss
WHERE ss.seat_id = ANY($1) AND ss.show_id = $2 AND ss.is_booked = false
FOR UPDATE;

Response:
[
  { id: 1, seat_id: 10, show_id: 1, user_id: 5, ... },
  { id: 2, seat_id: 11, show_id: 1, user_id: 5, ... },
  { id: 3, seat_id: 12, show_id: 1, user_id: 5, ... }
]
```

## Authentication Strategy

The system implements JWT-based authentication with hybrid token storage for maximum security and user experience.

### Implementation Details

- **Access Token**: Short-lived JWT token returned in API response. Frontend stores in localStorage and attaches to `Authorization: Bearer <token>` header.
- **Refresh Token**: Long-lived token stored in HttpOnly, Secure cookie, protecting against XSS attacks. Used to obtain new access tokens without user re-login.
- **Auth Middleware**: Centralized backend middleware verifies access tokens and injects user payload into request object for protected routes.
- **Session Validation**: Frontend validates user session and redirects to signin if token expires.

## Handling Concurrent Users

Prevents overbooking through PostgreSQL row-level locking with atomic transactions.

### Concurrency Control Mechanism

**Row-Level Locking with FOR UPDATE**

1. **Transaction Start**: Backend acquires dedicated connection from pool
2. **Row Lock**: Executes `SELECT ... FOR UPDATE` on requested seats
3. **Conflict Resolution**: Concurrent requests wait (not fail) until first transaction completes
4. **Atomicity**: All seats in a booking transaction succeed or all fail together
5. **Lock Release**: Lock automatically released upon transaction commit/rollback

**Benefits**:
- No double-bookings even under high concurrency
- Consistent read view within transaction
- Automatic lock timeout via connection lifecycle
- Clean handling of partial failures

## Security and Rate Limiting

Multi-layered security approach using express-rate-limit middleware.

### Rate Limiting Strategy

- **Global Limiter**: 100 requests per 15 minutes (general traffic)
- **Auth Limiter**: 5 requests per 15 minutes per IP (login/signup protection)
- **Booking Limiter**: 20 requests per minute (prevents seat-hoarding scripts)

### Other Security Measures

- CORS configuration for cross-origin requests
- Cookie-based token storage with HttpOnly and Secure flags
- Input validation on all endpoints
- Database query parameterization (prevents SQL injection)
- Error sanitization (no sensitive data in responses)

## Environment Configuration

### Backend .env File

Required variables in backend root directory:

```
PORT=8000
DATABASE_URL=postgresql://user:password@localhost:5432/book_my_ticket
ACCESS_TOKEN_SECRET=your_access_token_secret_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
NODE_ENV=development
```

### Frontend Configuration

Frontend environment variables (optional):
- API endpoints are dynamically determined from proxy.ts configuration
- Next.js handles client and server-side rendering

## Installation & Setup

### Backend

```bash
cd backend
pnpm install
pnpm run db:migrate
pnpm run dev
```

### Frontend

```bash
cd frontend
pnpm install
pnpm run dev
```

Open http://localhost:3000 to access the application.
