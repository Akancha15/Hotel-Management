import express from "express";
import { addStaff, deletedStaff, getAllStaff, updateStaff } from "../controllers/staff.controllers.js";
const staffRouter = express.Router();

staffRouter.post("/add-staff", addStaff);
staffRouter.get("/get-staff", getAllStaff);
staffRouter.delete("/delete-staff/:id", deletedStaff);
staffRouter.put("/update-staff/:id", updateStaff);

export default staffRouter; 