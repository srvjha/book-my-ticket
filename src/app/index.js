import express from "express";
import { authRoutes } from "./auth/routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";
import cookies from "cookie-parser";

export function createExpressApplication() {
  const app = express();

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookies());
  app.use(authMiddleware());

  // Routes
  app.get("/", (req, res) => {
    return res.json({
      message: "Welcome to Book My Ticket",
    });
  });
  app.use("/api/v1/auth", authRoutes);
  app.use(globalErrorHandler);

  return app;
}
