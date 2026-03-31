import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import songRoutes from './routes/songroutes.js';
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser'; // Import cookie-parser to handle cookies
import helmet from "helmet";
import path from "path";

const __dirname = path.resolve();

dotenv.config();
const app = express();
// since we are using cookies, if we dont set trust proxy, all users may appear as one IP, then rate limit breaks
// and also get the real user ip in the logs instead of the proxy ip
app.set("trust proxy", 1);

app.use(cookieParser()); // Add cookie-parser middleware to parse cookies in incoming requests

// Set security headers with Helmet and configure Content Security Policy (CSP) to allow resources only from the same origin and trusted sources
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], //Only load resources from your own server by default.
        scriptSrc: ["'self'"], // Allow JavaScript only from your server.
        connectSrc: ["'self'", process.env.FRONTEND_URL, ], //Allow API calls to your backend and frontend (using axios or fetch).
        imgSrc: ["'self'", "data:", "https:"], // Allow images from your server, data URIs (for inline images), and trusted external sources (like CDNs).
        styleSrc: ["'self'", "'unsafe-inline'"], //Allows css files and inline css
        fontSrc: ["'self'", "https:", "data:"], // Allows fonts from HTTPS font CDNs, your server, base64 fonts.
        objectSrc: ["'none'"], //Prevents Flash / plugin injection.
        baseUri: ["'self'"], // Stops attackers changing how URLs resolve.
        frameAncestors: ["'none'"], // Prevents clickjacking by disallowing site to be framed by any site. Adjust if you need to allow framing from specific origins (e.g., for embedding in a trusted partner site).
      },
    },
  })
);

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



app.get('/', (req, res) => {
    res.send('Welcome to the Song List API');
});

//ping route to check if server is awake
app.get("/ping", (req, res) => {
  res.json({ status: "awake" });
});


//routes
app.use('/api/users', userRoutes);
app.use('/api/songs', songRoutes);

// This is used to fix my routes redering blank pages on deployment. It serves the static files from the React build and ensures that all routes are handled by the React app, allowing for proper client-side routing in production. Without this, navigating directly to a route (e.g., /profile) would result in a 404 error because the server wouldn't know how to handle it.
// Serve frontend
app.use(express.static(path.join(__dirname, "frontend/dist")));

// Handle React routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
});

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