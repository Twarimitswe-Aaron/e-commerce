import express from 'express';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middleware/error.js';
import user from './controllers/user.js';
import cors from 'cors';
import dotenv from 'dotenv';
import cleanUpOraphanedFiles from './utils/fileCleanUp.js';
import cleanUpInactiveUsers from './utils/userCleanUp.js';


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
}));


if (process.env.NODE_ENV !== 'production') {
    dotenv.config({
        path: './config/.env',
    });
}

app.use('/', express.static('uploads'));
app.use('/api/v2/user', user);


// Error-handling middleware
app.use(errorMiddleware);
setInterval(cleanUpOraphanedFiles, 10*60*1000); 
cleanUpInactiveUsers();

export default app;