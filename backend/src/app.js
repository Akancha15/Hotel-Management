import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();

// ✅ CORS Configuration
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "*", 
        credentials: true,
    })
);



app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static("public")); 
app.use(cookieParser());


// ✅ Debugging: Check if ENV variables are loaded
console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN);

export { app };
