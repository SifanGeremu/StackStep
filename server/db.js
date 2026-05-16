import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri) {
    throw new Error("MongoDB connection string is not configured.");
  }

  await mongoose.connect(uri);
  console.log("MongoDB Atlas connected");
}

export default connectDB;