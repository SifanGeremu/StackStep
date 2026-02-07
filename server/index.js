import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import registerRoute from "./routes/register.route.js";
import loginRoute from "./routes/login.route.js";
import projectRoutes from "./routes/project.route.js";

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Connect DB
connectDB(process.env.ATLAS_URI);

// Test route
app.get("/", (req, res) => res.send("Hello World!"));

// Auth routes
app.use("/api/auth/register", registerRoute);
app.use("/api/auth/login", loginRoute);

// Project routes
app.use("/api/projects", projectRoutes); 

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
