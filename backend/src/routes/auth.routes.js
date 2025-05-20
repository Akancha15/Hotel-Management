import express from "express";
import { login } from "../controllers/auth.controllers.js";
const authRouter = express.Router();

authRouter.post("/login", login);

export default authRouter;