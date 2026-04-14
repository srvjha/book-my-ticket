import express from "express";
import BookingController from "./controller.js";
import { bookingLimiter } from "../middleware/rateLimit.middleware.js";
const bookingController = new BookingController();
const router = express.Router();

router.get("/seats",bookingLimiter,bookingController.seats.bind(bookingController))
router.get("/shows", bookingLimiter, bookingController.shows.bind(bookingController))
router.get("/shows/:id", bookingLimiter, bookingController.showDetails.bind(bookingController))
// router.put("/:id/:name",bookingLimiter,bookingController.bookSeat.bind(bookingController))
router.post("/book",bookingLimiter,bookingController.bookSeats.bind(bookingController))

export  {router as bookingRoutes};