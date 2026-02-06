import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // 1. Get token from Authorization header
  
  const authHeader = req.headers.authorization;

  // 2. Check token exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; 

  try {
    // 3. Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach decoded info to request object
    // This makes user data available in protected routes
    req.user = decoded;

    // 5. Call next() to pass control to the next middleware/route
    next();
  } catch (err) {
    // If verification fails (invalid or expired token)
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
