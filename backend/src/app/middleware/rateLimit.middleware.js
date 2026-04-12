import { rateLimit } from 'express-rate-limit'

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
   message: {
    statusCode: 429,
    message: "Too many requests. Please try again after 15 minutes.",
    data: null,
    success: false,
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 50,
   message: {
    statusCode: 429,
    message: "Too many requests. Please try again after 15 minutes.",
    data: null,
    success: false,
  },
});

const bookingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 20,
   message: {
    statusCode: 429,
    message: "Too many requests. Please try again after 1 minute.",
    data: null,
    success: false,
  },
});

export { globalLimiter, authLimiter, bookingLimiter }