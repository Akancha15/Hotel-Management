import express from "express";
import { addbooking, deletedBooking, getAllBooking, updateBooking } from "../controllers/booking.controllers.js";
const bookingRouter = express.Router();

bookingRouter.post("/add-booking",addbooking);
bookingRouter.get("/get-booking", getAllBooking );
bookingRouter.delete("/delete-booking/:id",deletedBooking);
bookingRouter.put("/update-booking/:id",updateBooking);

export default bookingRouter;