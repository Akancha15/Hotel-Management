import express from "express";
import { addFinance, deletedFinance, getAllFinance, updateFinance } from "../controllers/finance.controllers.js";

const financeRouter = express.Router();

financeRouter.post("/add-finance", addFinance );
financeRouter.get("/get-finance", getAllFinance );
financeRouter.delete("/delete-finance/:id", deletedFinance );
financeRouter.put("/update-finance/:id", updateFinance);

export default financeRouter;