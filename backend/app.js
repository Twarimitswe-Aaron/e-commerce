import express from 'express';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middleware/error.js';
import userRouter from './controllers/user.js'; // Renamed for clarity
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cleanUpOrphanedFiles from './utils/fileCleanUp.js'; // Fixed typo in variable name
import cleanUpInactiveUsers from './utils/userCleanUp.js';
import morgan from 'morgan'; // For HTTP request logging

// ES modules path handling
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Environment configuration
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './config/.env' });
}

// Security Middleware
app.use(helmet());
app.use(cookieParser());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Static files
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// API Routes
app.use('/api/v2/user', apiLimiter, userRouter); // Apply rate limiting to user routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Scheduled tasks
const TEN_MINUTES = 10 * 60 * 1000;
setInterval(cleanUpOrphanedFiles, TEN_MINUTES); 
setInterval(cleanUpInactiveUsers, 24 * 60 * 60 * 1000); // Daily cleanup

// Error handling (should be last middleware)
app.use(errorMiddleware);

// Handle 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
    error: {
      statusCode: 404,
      message: 'The requested resource was not found'
    }
  });
});

export default app;