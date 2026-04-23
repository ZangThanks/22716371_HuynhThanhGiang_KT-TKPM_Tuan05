const express = require("express");
const app = express();

app.use(express.json());

const serviceName = process.env.SERVICE_NAME || "api";

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: serviceName });
});

// Home
app.get("/", (req, res) => {
  res.json({
    message: "⚙️ API Service Running",
    service: serviceName,
    description: "API service accessible through custom network",
    endpoints: {
      "/health": "Health check",
      "/data": "Get sample data",
      "/network-info": "Get network information",
    },
  });
});

// Get data
app.get("/data", (req, res) => {
  res.json({
    status: "success",
    data: {
      id: 1,
      name: "Sample Data from API",
      timestamp: new Date().toISOString(),
      source: serviceName,
    },
    message: "✅ Data retrieved successfully from API service",
  });
});

// Network info
app.get("/network-info", (req, res) => {
  res.json({
    service: serviceName,
    container_name: "bai14-api",
    network: "bai14-private-network",
    accessible_services: [
      { name: "web", url: "http://web:3000", description: "Web service" },
      {
        name: "postgres",
        url: "postgres://db_user:db_pass@postgres:5432/bai14_db",
        description: "Database",
      },
    ],
    note: "This service can communicate with other services in the same network",
  });
});

// Echo service name
app.get("/service-name", (req, res) => {
  res.json({
    service: serviceName,
    container: process.env.HOSTNAME || "unknown",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n⚙️  API Service running on port ${PORT}`);
  console.log(`📡 Connected to network: bai14-private-network`);
  console.log(`📦 Database URL: ${process.env.DATABASE_URL}\n`);
});
