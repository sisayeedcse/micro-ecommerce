require("dotenv").config();
const express = require("express");
const cors = require("cors");
const client = require("prom-client");

const orderRoutes = require("./routes/orderRoutes");
require("./config/db");

const app = express();
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const requestHistogram = new client.Histogram({
  name: "order_service_http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds in the order-service",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

const requestCounter = new client.Counter({
  name: "order_service_http_requests_total",
  help: "Total number of HTTP requests processed by the order-service",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

app.use(cors());
app.use(express.json());

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

app.get("/", (req, res) => {
  res.json({ message: "Order service is running" });
});

app.use("/orders", orderRoutes);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Order service listening on port ${PORT}`);
});
