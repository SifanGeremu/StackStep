import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import registerRoute from "./routes/register.route.js";
import loginController from "./controller/login.controller.js";
import authMiddleware from "./middleware/auth.js";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Connect MongoDB Atlas
connectDB(process.env.ATLAS_URI);

// Test route
app.get("/", (req, res) => res.send("Hello World!"));
//test protected route
app.get("/api/projects", authMiddleware, (req, res) => {
  res.json({ message: `Hello ${req.user.email}, you have access!` });
});

//register route
app.use("/api",registerRoute);
//login route 
app.use("/api",loginController)

//Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
