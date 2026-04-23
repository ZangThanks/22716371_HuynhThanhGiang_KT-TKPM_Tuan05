const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const MONGODB_URI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}?authSource=admin`;

let db;
const client = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
});

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    db = client.db(process.env.MONGODB_DB);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    setTimeout(connectDB, 5000);
  }
}

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "Node.js + MongoDB" });
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await db.collection("users").find({}).toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create user
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await db.collection("users").insertOne({
      name,
      email,
      createdAt: new Date(),
    });
    res.json({ _id: result.insertedId, name, email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await db.collection("products").find({}).toArray();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product
app.post("/products", async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    const result = await db.collection("products").insertOne({
      name,
      price,
      stock,
      createdAt: new Date(),
    });
    res.json({ _id: result.insertedId, name, price, stock });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get database stats
app.get("/stats", async (req, res) => {
  try {
    const usersCount = await db.collection("users").countDocuments();
    const productsCount = await db.collection("products").countDocuments();
    res.json({
      users: usersCount,
      products: productsCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Node.js + MongoDB server running on port ${PORT}`);
  });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await client.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});
