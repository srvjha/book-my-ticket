import express from "express";
import BookingController from "./controller.js";
import { bookingLimiter } from "../middleware/rateLimit.middleware.js";
const bookingController = new BookingController();
const router = express.Router();

router.get("/seats",bookingLimiter,bookingController.seats.bind(bookingController))
router.put("/:id/:name",bookingLimiter,bookingController.bookSeat.bind(bookingController))

export  {router as bookingRoutes};