import express from "express";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes); // Middleware should be before `app.listen()`

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    connectDB();
});
