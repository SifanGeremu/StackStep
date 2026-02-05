import "dotenv/config";
import express from "express";
import { toNodeHandler } from "better-auth/node";
import mongoose from "mongoose";
import cors from "cors";

import auth from "./Auth/auth.js";
import connectDB from "./db.js";

const app = express();
const PORT = process.env.PORT;

// Mount Better Auth handler
app.use("/api/auth", toNodeHandler(auth));

app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
connectDB(process.env.ATLAS_URI);

// Test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Example protected route
// app.get("/api/projects", auth.protect, async (req, res) => {
//   res.json({ projects: [], user: req.user });
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
