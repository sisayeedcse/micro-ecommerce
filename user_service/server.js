const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const client = require("prom-client");

// Load environment variables before other imports rely on them.
dotenv.config();

// Initialize database connection (also ensures table creation).
require("./config/db");

const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Prometheus metrics registry and collectors
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const requestHistogram = new client.Histogram({
  name: "user_service_http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds in the user-service",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

const requestCounter = new client.Counter({
  name: "user_service_http_requests_total",
  help: "Total number of HTTP requests processed by the user-service",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

app.use(cors());
app.use(express.json());

// Basic request metrics middleware
app.use((req, res, next) => {
  const end = requestHistogram.startTimer();
  res.on("finish", () => {
    const route = req.route?.path || req.originalUrl || req.path;
    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode),
    };

    end(labels);
    requestCounter.inc(labels);
  });
  next();
});

app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end(error.message);
  }
});

app.use("/", authRoutes);

app.get("/", (req, res) => {
  res.json({ status: "user-service is running" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`user-service listening on port ${PORT}`);
});
