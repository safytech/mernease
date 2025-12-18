import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { handleErrorMiddleware } from "./utils/error.js";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

// Default test route
app.get('/', (req, res) => {
  res.send("Hello World!");
});


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(handleErrorMiddleware);

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("MongoDB connected");

    app.listen(3000, () => {
      console.log("Server started on http://localhost:3000");
    });

  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
