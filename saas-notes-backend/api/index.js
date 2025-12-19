const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const authRoutes = require("../routes/auth");
const issuesRoutes = require("../routes/issues");
const tenantRoutes = require("../routes/tenants");
const menuRoutes = require("../routes/menus");
const projectsRoutes = require("../routes/projects");

const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "https://notesverse-delta.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));



app.use(cookieParser());


app.use(express.json());

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Routes
app.use("/auth", authRoutes);
app.use("/issues", issuesRoutes);
app.use('/tenants', tenantRoutes);
app.use('/menu', menuRoutes);
app.use('/projects', projectsRoutes);


const port = process.env.PORT || 4000;
module.exports = app;
