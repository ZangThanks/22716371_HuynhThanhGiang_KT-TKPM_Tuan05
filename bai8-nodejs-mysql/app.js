const express = require("express");
const mysql = require("mysql2/promise");
const app = express();

app.use(express.json());

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root123",
  database: process.env.DB_NAME || "nodedb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Initialize database
async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    connection.release();
    console.log("Database initialized");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
}

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Node.js + MySQL service is running" });
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute("SELECT * FROM users");
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create user
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email],
    );
    connection.release();
    res.json({ id: result.insertId, name, email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Node.js + MySQL server running on port ${PORT}`);
  });
});
