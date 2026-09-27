const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const path = require("path");

// Import route modules
const bookRoutes = require("../routes/books");
const authRoutes = require("../routes/auth");
const borrowRoutes = require("../routes/borrows");
const paymentRoutes = require("../routes/payments");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "..", "build")));

// Mount API routes
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/borrows", borrowRoutes);
app.use("/api/payments", paymentRoutes);

// Fallback for SPA routing
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

// MongoDB connection cache for Vercel serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null
  };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is not set");
    }

    cached.promise = mongoose
      .connect(mongoUri, {
        dbName: "libraryDB"
      })
      .then((mongooseInstance) => {
        console.log("MongoDB connected successfully");
        return mongooseInstance;
      })
      .catch((error) => {
        cached.promise = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

const handler = serverless(app);

module.exports = async (req, res) => {
  await connectDB();
  return handler(req, res);
};