const express = require("express");
const cors = require("cors");

const app = express();

/* ===============================
   🔹 GLOBAL MIDDLEWARE
================================ */
app.use(cors());
app.use(express.json());

/* ===============================
   🔹 BASE HEALTH ROUTE
================================ */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Skill Gap Backend Running 🚀"
  });
});

/* ===============================
   🔹 ROUTES
================================ */

// Users
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// Dashboard
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

// Tech Domains
const domainRoutes = require("./routes/domainRoutes");
app.use("/api/domains", domainRoutes);

// 🔐 Auth Routes (Register / Login / Me)
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// 🔥 AI Routes (Groq Integration)
const aiRoutes = require("./routes/aiRoutes");
app.use("/api/ai", aiRoutes);

// 📊 Coding Stats Routes
const codingStatsRoutes = require("./routes/codingStatsRoutes");
app.use("/api/coding-stats", codingStatsRoutes);


/* ===============================
   🔹 404 HANDLER
================================ */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});


module.exports = app;