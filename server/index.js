import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB(process.env.ATLAS_URI);
//test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});