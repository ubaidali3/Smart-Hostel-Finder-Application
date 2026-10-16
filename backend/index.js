
import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDb from "./config/mongoDb.js";
import connectCloudinary from "./config/cloudinary.js";

import userRouter from "./routes/user.router.js";
import hostelRouter from "./routes/hostel.router.js";
import RoomRouter from "./routes/room.router.js";
import applicationRouter from "./routes/application.router.js";
import FeeRouter from "./routes/fee.router.js";
import PaymentRouter from "./routes/payment.router.js";
import noticeRouter from "./routes/notice.router.js";
import complaintRouter from "./routes/complaint.router.js";

const app = express();
const port = process.env.PORT || 3000;

// Database and Cloudinary
connectDb();
connectCloudinary();

// Middleware
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://smart-hostel-finder-application-eo9.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// API Routes
app.use("/api/user", userRouter);
app.use("/api/hostel", hostelRouter);
app.use("/api/rooms", RoomRouter);
app.use("/api/applications", applicationRouter);
app.use("/api/fees", FeeRouter);
app.use("/api/payments", PaymentRouter);
app.use("/api/notices", noticeRouter);
app.use("/api/complaints", complaintRouter);

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HostelHub Backend API is running"
  });
});

// Local Development
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

// Export for Vercel
export default app;
