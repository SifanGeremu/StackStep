import mongoose from "mongoose";

export async function connectDB(uri) {
  try {
    await mongoose.connect(uri); 
    console.log("MongoDB Atlas connected");
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1);
  }
}

export default connectDB;