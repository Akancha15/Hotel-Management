import express from "express";
import { addGuest, deletedGuest, getAllGuest, updateGuest } from "../controllers/guest.controllers.js";
const guestRouter = express.Router();

guestRouter.post("/add-guest", addGuest);
guestRouter.get("/get-guest", getAllGuest);
guestRouter.delete("/delete-guest/:id", deletedGuest);
guestRouter.put("/update-guest/:id", updateGuest);

export default guestRouter; 