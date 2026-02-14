import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import registerRoute from "./routes/register.route.js";
import loginRoute from "./routes/login.route.js";
import projectRoutes from "./routes/project.route.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Configure CORS origins: include local dev client when not in production
const allowedOrigins = ["https://stack-step.vercel.app"];
if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push("http://localhost:5173", "http://127.0.0.1:5173");
}
if (process.env.CLIENT_ORIGIN) {
  allowedOrigins.push(process.env.CLIENT_ORIGIN);
}

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
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
