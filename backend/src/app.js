const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const logger = require("./config/logger");
const {
  requestLogger,
  notFound,
  errorHandler,
} = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  morgan("combined", { stream: logger.stream, skip: () => process.env.NODE_ENV === "test" })
);
app.use(requestLogger);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "BeYuumi API is running",
    endpoints: {
      health: "GET /api/health",
      register: "POST /api/auth/register",
      login: "POST /api/auth/login",
      profile: "GET /api/auth/profile",
      forgotPassword: "POST /api/auth/forgot-password",
      resetPassword: "POST /api/auth/reset-password",
      orders: "GET|POST /api/orders, GET /api/orders/:id",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "ok", uptime: process.uptime() });
});

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
