import express from "express";
import { addRoom, deletedRoom, getAllRoom, updateRoom } from "../controllers/room.controllers.js";
const roomRouter = express.Router();

roomRouter.post("/add-room", addRoom);
roomRouter.get("/get-room",getAllRoom);
roomRouter.delete("/delete-room/:id",deletedRoom);
roomRouter.put("/update-room/:id", updateRoom);

export default roomRouter;