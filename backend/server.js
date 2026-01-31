import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import songRoutes from './routes/songroutes.js';

dotenv.config();
const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL, //frontend origin
        credentials: true, //allow cookies to be sent
    }));
app.use(express.json());

//middleware that logs the path and method user visits in the console
// app.use((req, res, next) => {
//     console.log(req.path, req.method);
//     next();
// })

//routes
app.use('/api/songs', songRoutes);

//start server
const startserver = async () => {
    try {
        await mongoose.connect(process.env.MY_DB);
        console.log("Database connected successfully");
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
    }
}
startserver();