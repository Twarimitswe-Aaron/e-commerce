import express from 'express';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middleware/error.js';
import userRouter from './controllers/user.js';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cleanUpOrphanedFiles from './utils/fileCleanUp.js'; 
import cleanUpInactiveUsers from './utils/userCleanUp.js';
import morgan from 'morgan';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './config/.env' });
}


app.use(helmet());
app.use(cookieParser());


const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});


const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}


const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));


app.use('/api/v2/user', apiLimiter, userRouter);


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Scheduled tasks
const TEN_MINUTES = 10 * 60 * 1000;
const DAILY= 24 * 60 * 60 * 1000;
setInterval(cleanUpOrphanedFiles, TEN_MINUTES); 
setInterval(cleanUpInactiveUsers, DAILY);


app.use(errorMiddleware);


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