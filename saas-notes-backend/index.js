const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");
const tenantRoutes = require("./routes/tenants");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Routes
app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);
app.use('/tenants',tenantRoutes );


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
