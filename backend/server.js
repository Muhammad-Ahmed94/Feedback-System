import express from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import connectDB from './lib/db.js';

dotenv.config();

// PORT
const app = express();
const port = process.env.PORT || 5000;

// MIDDLEWARE
app.use(compression());
app.use(cors(
    {
        origin: [
            "http://localhost:5173"
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Cookie',
            'Accept',
            'Origin',
            'X-Requested-with'
        ]
    }
));
app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Forever Backend',
    environment: process.env.NODE_ENV,
    port: port
  });
});

// ROUTES

app.listen(port, () => {
    console.log("⚙️ server running on port", port);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🏥 Health check: http://localhost:${port}/health`);
    connectDB();
});