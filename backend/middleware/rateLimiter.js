import rateLimit from "express-rate-limit";

//Middleware for refresh token route to prevent brute force attacks, only 10 attempts allowed in 15 mins
export const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many refresh requests." }
});

//Middleware to protect Login route from brute force attacks, only 5 attempts allowed in 15 mins
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 5, // only 5 attempts
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: "Too many login attempts. Try again later." }
});

//Middleware to protect change password route from brute force attacks, only 5 attempts allowed in 15 mins
export const changeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 5, // only 5 attempts
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: "Too many attempts. Try again later." }
});

//General rate limiter for all song routes, can be adjusted as needed
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: "Too many requests, please try again later."
  }
});

export default limiter;