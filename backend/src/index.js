import dotenv from "dotenv";
dotenv.config(); // Load environment variables before anything else
import guestRouter from "./routes/guest.routes.js";
import roomRouter from "./routes/room.routes.js";
import staffRouter from "./routes/staff.routers.js";
import bookingRouter from "./routes/booking.routes.js";
import discountRouter from "./routes/discount.routes.js";
import financeRouter from "./routes/finance.routes.js";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import authRouter from "./routes/auth.routes.js";
import { createInitialAdmin } from "./controllers/auth.controllers.js";

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.use("/guest", guestRouter);
    app.use("/room",roomRouter);
    app.use("/staff",staffRouter);
    app.use("/booking",bookingRouter);
    app.use("/discount",discountRouter);
    app.use("/finance",financeRouter);
    app.use("/auth", authRouter);
    createInitialAdmin();
    
    app.listen(PORT, () => {
      console.log(`✅ Server is running at port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });