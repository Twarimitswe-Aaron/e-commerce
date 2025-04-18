import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import errorMiddleware from './middleware/error.js';
import user from './controllers/user.js';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(cors());

if (process.env.NODE_ENV !== 'production') {
    dotenv.config({
        path: './config/.env',
    });
}

app.use('/', express.static('uploads'));
app.use('/api/v2/user', user);

// Error-handling middleware
app.use(errorMiddleware);

export default app;