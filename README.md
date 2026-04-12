# Stellar Cinema
<img width="1366" height="617" alt="image" src="https://github.com/user-attachments/assets/855dc981-3b7b-4d3d-a71d-c34ff5d09a51" />


A professional movie ticket booking system with a focus on security, concurrency management, and a premium user experience.

## Project Structure

### Backend (Node.js/Express)

The backend is organized using a feature-based architecture.

- **src/index.js**: Entry point for the HTTP server.
- **src/app/index.js**: Express application setup including global middlewares.
- **src/db/index.js**: Database connection pooling and query utility.
- **src/config/env.js**: Environment variable validation using Zod.
- **src/app/auth/**: Contains authentication controllers, services, and utilities.
- **src/app/booking/**: Manages seat selection and reservation logic.
- **src/app/middleware/**: Global middlewares for authentication, error handling, and rate limiting.
- **src/utils/**: Shared utility classes like ApiResponse and ApiError.

### Frontend (Vanilla JS)

A multi-page application focused on speed and modularity.

- **index.html**: Landing page with movie details.
- **booking.html**: Interactive seat selection map.
- **signin.html / signup.html**: Authentication forms.
- **js/api.js**: Centralized API utility for handling fetch requests and auth headers.

## Authentication Strategy

The system uses a JWT (JSON Web Token) based authentication system with a hybrid storage approach.

### Implementation Details

- **Access Token**: Generated on login and returned in the JSON response. The frontend stores this in localStorage and attaches it to the Authorization: Bearer <token> header for subsequent requests.
- **Refresh Token**: Set as an HttpOnly, Secure cookie to protect against XSS (Cross-Site Scripting). This token is used to generate new access tokens without requiring the user to log in again.
- **Auth Middleware**: A centralized middleware on the backend verifies the access token for protected routes and injects the user payload into the request object.

## Handling Concurrent Users

To prevent overbooking (two users booking the same seat simultaneously), the system implements robust concurrency control at the database level.

### Key Mechanism: Row-Level Locking

When a booking request is initiated, the backend uses a PostgreSQL transaction with the FOR UPDATE clause.

1.  **Transaction Start**: A new database connection is acquired from the pool.
2.  **Row Lock**: The query SELECT ss.\* FROM show_seats ss WHERE ss.seat_id = $1 AND ss.is_booked = false FOR UPDATE is executed. This locks the specific seat row.
3.  **Conflict Resolution**: If another user is currently booking the same seat, their transaction will wait until the first one is committed or rolled back.
4.  **Atomic Update**: Once the lock is acquired, the seat is marked as booked, and the transaction is committed, releasing the lock.

## Security and Rate Limiting

The application uses express-rate-limit to protect against brute-force attacks and denial-of-service attempts.

- **Global Limiter**: Limits general traffic to 100 requests per 15 minutes.
- **Auth Limiter**: Strictly limits login and signup attempts to 5 per 15 minutes per IP address.
- **Booking Limiter**: Restricts booking actions to 20 requests per minute to prevent script-based seat hoarding.

## Environment Configuration

The project requires a .env file in the backend root with the following variables:

- PORT: Server port (default 8000)
- DATABASE_URL: PostgreSQL connection string
- ACCESS_TOKEN_SECRET: Secret key for signing access tokens
- REFRESH_TOKEN_SECRET: Secret key for signing refresh tokens
- ACCESS_TOKEN_EXPIRY: Duration for access token validity (e.g., 15m)
- REFRESH_TOKEN_EXPIRY: Duration for refresh token validity (e.g., 7d)
