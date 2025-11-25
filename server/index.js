import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import serverless from 'serverless-http';

import { handleErrorMiddleware } from "./utils/error.js";

// 🌟 Static Route Imports
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";

dotenv.config();
const app = express();

// -------------------------------------------------------------
// Middlewares
// -------------------------------------------------------------
app.use(express.json());
app.use(cookieParser());

// Test route
app.get('/', (req, res) => {
  res.send("Hello from MERNEASE API!");
});

// -------------------------------------------------------------
// API Routes
// -------------------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

// -------------------------------------------------------------
// Error Handler
// -------------------------------------------------------------
app.use(handleErrorMiddleware);

// -------------------------------------------------------------
// MongoDB Connection
// -------------------------------------------------------------
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// -------------------------------------------------------------
// Local Mode (Normal Express Server)
// -------------------------------------------------------------
if (process.env.VERCEL !== "1") {
  app.listen(3000, () => {
    console.log("🚀 Local server running at http://localhost:3000");
  });
}

// -------------------------------------------------------------
// Vercel Serverless Export
// -------------------------------------------------------------
export const handler = serverless(app);
export default app;
