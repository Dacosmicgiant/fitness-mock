import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import path from "path";
import fs from 'fs';

// Route imports
import authRoutes from './routes/auth.route.js';
import certificationRoutes from './routes/certificationRoutes.js';
import moduleRoutes from './routes/moduleRoutes.js';
import testRoutes from './routes/testRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));