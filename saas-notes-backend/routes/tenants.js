const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();


router.get('/', async (req,res)=>{
  res.status(200).json({message: "Tenant route works"})
});

router.post("/register", async (req, res) => {
  const { name, slug, adminEmail, adminPassword } = req.body;

  if (!name || !slug || !adminEmail || !adminPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // 1. Check if tenant exists
    const tenantCheck = await pool.query(
      "SELECT id FROM tenants WHERE name = $1",
      [name]
    );

    if (tenantCheck.rows.length > 0) {
      return res.status(400).json({ message: "Tenant slug already exists" });
    }

    // 2. Insert tenant
    const newTenant = await pool.query(
      "INSERT INTO tenants (name, slug, plan) VALUES ($1, $2, $3) RETURNING id",
      [name, slug, "FREE"]
    );

    const tenantId = newTenant.rows[0].id;

    // 3. Hash admin password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // 4. Insert admin user
    const newUser = await pool.query(
      `INSERT INTO users (tenant_id, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, role`,
      [tenantId, adminEmail, hashedPassword, "ADMIN"]
    );

    const user = newUser.rows[0];

    // 5. Generate JWT
    const token = jwt.sign(
      { userId: user.id, tenantId, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Tenant registered successfully",
      tenant: { id: tenantId, name, slug },
      user,
      token,
    });
  } catch (error) {
    console.error("Error registering tenant:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
