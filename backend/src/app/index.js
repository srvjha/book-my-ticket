import express from "express";
import { authRoutes } from "./auth/routes.js";
import { bookingRoutes } from "./booking/routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";
import cookies from "cookie-parser";
import cors from "cors"

export function createExpressApplication() {
  const app = express();

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookies());
  app.use(cors({
    origin: [process.env.CORS_ORIGIN, "http://localhost:3000"],
    credentials: true,
  }));
  app.use(authMiddleware());

  // Routes
  app.get("/", (req, res) => {
    return res.json({
      message: "Welcome to Book My Ticket",
    });
  });
  app.use("/api/v1/auth", authRoutes);
  app.use("/",bookingRoutes)
  app.use(globalErrorHandler);

  return app;
}
