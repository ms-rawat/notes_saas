const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");
const tenantRoutes = require("./routes/tenants");
const menuRoutes = require("./routes/menus");
const notes = require("./routes/notes")
const categories = require("./routes/categories")

const app = express();
app.use(cors({
  origin: ["http://localhost:5173","https://notesverse-delta.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],         
}));

app.options(/.*/, cors({
  origin: [
    "http://localhost:5173",
    "https://notesverse-delta.vercel.app",
  ],
  credentials: true,
}));


app.use(cookieParser());


app.use(express.json());

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Routes
app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);
app.use('/tenants',tenantRoutes );
app.use('/menu',menuRoutes);
app.use('/notes',notes)
app.use('/categories',categories)


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
