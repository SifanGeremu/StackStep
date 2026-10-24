import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri) {
    throw new Error(
      "MongoDB connection string is not configured. Set ATLAS_URI, MONGO_URI, or MONGODB_URI on Render.",
    );
  }

  const host = uri.match(/@([^/?]+)/)?.[1] ?? "unknown";
  console.log(`Connecting to MongoDB host: ${host}`);

  try {
    // ponytail: family:4 avoids Render IPv6 DNS issues reaching Atlas
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000, family: 4 });
    console.log("MongoDB Atlas connected");
  } catch (error) {
    const msg = error.message ?? String(error);
    if (msg.includes("authentication failed")) {
      throw new Error(
        "MongoDB auth failed — wrong username/password in connection string.",
      );
    }
    if (msg.includes("ENOTFOUND")) {
      throw new Error(
        `MongoDB host not found (${host}) — re-copy connection string from Atlas.`,
      );
    }
    throw error;
  }
}

export default connectDB;