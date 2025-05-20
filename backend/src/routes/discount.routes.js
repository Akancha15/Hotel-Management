import express from "express";
import { addDiscount, deleteDiscount, getAllDiscount, updateDiscount } from "../controllers/discount.controllers.js";
const discountRouter = express.Router();

discountRouter.post("/add-discount", addDiscount);
discountRouter.get("/get-alldiscount", getAllDiscount);
discountRouter.put("/update-discount/:id", updateDiscount);
discountRouter.delete("/delete-discount/:id", deleteDiscount);

export default discountRouter;