import express from "express";
import BookingController from "./controller.js";

const bookingController = new BookingController();
const router = express.Router();

router.get("/seats",bookingController.seats.bind(bookingController))
router.put("/:id/:name",bookingController.bookSeat.bind(bookingController))

export  {router as bookingRoutes};