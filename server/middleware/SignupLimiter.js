import rateLimit from "express-rate-limit";

// Limit signup attempts to max 5 per IP per minute
const signupLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    message: "Too many signup attempts, please try again later.",
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

export default signupLimiter;
