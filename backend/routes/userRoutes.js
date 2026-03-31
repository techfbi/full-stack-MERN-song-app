import express from 'express';
import UserModel from '../models/usermodels.js';
import jwt from 'jsonwebtoken';
import xss from 'xss'; // Import xss to sanitize user input and prevent XSS attacks
import { refreshLimiter, loginLimiter, changeLimiter } from '../middleware/rateLimiter.js';


const router = express.Router();

// Helper functions to generate access and refresh tokens
const accessToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, { expiresIn: '10m' });
}
const refreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_SECRET, { expiresIn: '1d' }); 
}



// Refresh token route
router.post("/refresh", refreshLimiter, async (req, res) => {

  const refToken = req.cookies.refreshJWT; // Get the refresh token from the cookie

  if (!refToken) {
    console.error("No refresh token provided");
    return res.status(401).json({ error: "No refresh token provided" });
  }

  try {
    // Verify the refresh token and extract the user ID
    const { id } = jwt.verify(refToken, process.env.REFRESH_SECRET);

    // Fetch user from DB so i can get the email
    const user = await UserModel.findById(id).select("email");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
   
    // Generate a new access token using the user ID
    const newAccessToken = jwt.sign({ id }, process.env.SECRET, { expiresIn: "10m" });
    res.json({ email: user.email, accessToken: newAccessToken }); // Send the new access token in the response

  } catch (error) {
    console.error("Invalid refresh token:", error.message);
    return res.status(403).json({ error: "Invalid refresh token" });
  }

});


//User routes

router.post("/signup", async (req, res) => {
    const { email, password, securityQue, securityAns } = req.body;
    try {
      const lowerMail = email.toLowerCase(); // Convert email to lowercase for consistency
      const cleanEmail = xss(lowerMail); // Sanitize email input to prevent XSS attacks
      const user = await UserModel.signup(cleanEmail, password, securityQue, securityAns);

      //create tokens
      const myAccessToken = accessToken(user._id);
      const myRefreshToken = refreshToken(user._id);

      res.cookie("refreshJWT", myRefreshToken, { 
          httpOnly: true, 
          secure: true, // Set to true in production when using HTTPS
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000 // 1 day
      }); // Set the JWT as an HTTP-only cookie

      res.status(201).json({ email, accessToken: myAccessToken }); // Return the created user object and token in the response
    } catch (error) {
      console.error("Signup error:", error.message);
      res.status(500).json({ error: error.message });
    }
});



router.post("/login", loginLimiter, async (req, res) => {
    const { email, password } = req.body;
    try {
      const lowerMail = email.toLowerCase(); // Convert email to lowercase for consistency
      const cleanEmail = xss(lowerMail); // Sanitize email input to prevent XSS attacks
      const user = await UserModel.login(cleanEmail, password);

        //create a token
        const myAccessToken = accessToken(user._id);
        const myRefreshToken = refreshToken(user._id);

        res.cookie("refreshJWT", myRefreshToken, {
             httpOnly: true, 
             secure: true, // Set to true in production when using HTTPS
             sameSite: "None",
             maxAge: 24 * 60 * 60 * 1000 // 1 day
            }); // Set the JWT as an HTTP-only cookie

        res.status(201).json({ email, accessToken: myAccessToken }); // Return the created user object and token in the response
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(400).json({ error: error.message });
    }
});



router.post("/forgot-mail-check", async (req, res) => {
  const {email} = req.body;
  if (!email) {
    return res.status(400).json({error: "email field must not be empty"});
  }
  try {
    const lowerMail = email.toLowerCase(); // Convert email to lowercase for consistency
    const cleanEmail = xss(lowerMail); // Sanitize email input to prevent XSS attacks
    const userFound = await UserModel.findOne({email: cleanEmail});
    if (!userFound) {
      return res.status(404).json({ error: "Email does not exist" });
    }
    res.status(201).json({securityQue: userFound.securityQue})
  } catch (error) {
    console.error("Forgot user mail fetch error", error.message);
    res.status(500).json({error: "Server error"});
  } 
})



router.post("/change-password", changeLimiter, async (req, res) => {
  const {email, newPassword, securityAns} = req.body;
  try {
    const lowerMail = email.toLowerCase(); // Convert email to lowercase for consistency
    const cleanEmail = xss(lowerMail); // Sanitize email input to prevent XSS attacks
    const user = await UserModel.forgot(cleanEmail, newPassword, securityAns);
    res.clearCookie("refreshJWT");

    //create new tokens to invalidate the old ones
     const myAccessToken = accessToken(user._id);
     const myRefreshToken = refreshToken(user._id);

    res.cookie("refreshJWT", myRefreshToken, {
             httpOnly: true, 
             secure: true, // Set to true in production when using HTTPS
             sameSite: "None",
             maxAge: 24 * 60 * 60 * 1000 // 1 day
            });


    res.status(201).json({ email, message: "Password changed successfully" });

  } catch(error) {
    console.error("Error Changing password:", error.message);
    res.status(400).json({ error: error.message });
  }
})

export default router;