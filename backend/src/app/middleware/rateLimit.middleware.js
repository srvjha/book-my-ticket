import { rateLimit } from 'express-rate-limit'

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000,
   message: {
    statusCode: 429,
    message: "Too many requests. Please try again after 15 minutes.",
    data: null,
    success: false,
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 500,
   message: {
    statusCode: 429,
    message: "Too many requests. Please try again after 15 minutes.",
    data: null,
    success: false,
  },
});

const bookingLimiter = rateLimit({
  windowMs: 20 * 60 * 1000, // 20 minutes
  limit: 200,
   message: {
    statusCode: 429,
    message: "Too many requests. Please try again after 20 minutes.",
    data: null,
    success: false,
  },
});

export { globalLimiter, authLimiter, bookingLimiter }