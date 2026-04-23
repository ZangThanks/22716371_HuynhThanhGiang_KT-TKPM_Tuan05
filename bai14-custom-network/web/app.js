const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const apiUrl = process.env.API_URL || "http://api:5000";
const serviceName = process.env.SERVICE_NAME || "web";

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: serviceName });
});

// Home page
app.get("/", (req, res) => {
  res.json({
    message: "🌐 Web Service Running",
    service: serviceName,
    description: "Communicating with API service through custom network",
    api_endpoint: apiUrl,
  });
});

// Call API service
app.get("/call-api", async (req, res) => {
  try {
    // Service discovery using DNS - resolves 'api' hostname to container IP
    const response = await axios.get(`${apiUrl}/data`);
    res.json({
      message: "✅ Successfully called API service",
      service: serviceName,
      api_response: response.data,
      note: "Communication happens through custom network (bai14-private-network)",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to call API service",
      message: error.message,
      hint: "Make sure API service is running and accessible in the custom network",
    });
  }
});

// Get network info
app.get("/network-info", (req, res) => {
  res.json({
    service: serviceName,
    network: "bai14-private-network",
    container_name: "bai14-web",
    accessible_services: [
      { name: "api", url: "http://api:5000", description: "API service" },
      {
        name: "postgres",
        url: "postgres://db_user:db_pass@postgres:5432/bai14_db",
        description: "Database",
      },
    ],
    note: "Containers can communicate using service names as hostnames",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🌐 Web Service running on port ${PORT}`);
  console.log(`📡 Connected to network: bai14-private-network`);
  console.log(`🔗 API URL: ${apiUrl}\n`);
});
