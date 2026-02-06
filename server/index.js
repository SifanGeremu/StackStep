import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import registerRoute from "./routes/register.route.js";
import loginRoute from "./routes/login.route.js";
import authMiddleware from "./middleware/auth.js";
import projectRoutes from "./routes/project.route.js";
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


//register route
app.use("/api",registerRoute);
//login route 
app.use("/api",loginRoute)

//project routes
app.use("/api",projectRoutes)

//Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
