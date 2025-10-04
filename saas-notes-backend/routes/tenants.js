const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const router = express.Router();


router.get('/SearchTenants', async (req,res)=>{
  const {SearchKeyword} = req.query;
  try{
    const getTenants = await pool.query(
      "SELECT * FROM tenants WHERE name LIKE $1",
      [`%${SearchKeyword}%`]
    );
     res.status(200).json(getTenants.rows);
  }catch(err){
    console.error(err);
      return res.status(500).json({error: err.message})
    
  }

});

router.post("/register", async (req, res) => {
  const { name, adminEmail, adminPassword } = req.body;

  if (!name  || !adminEmail || !adminPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const tenantCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [adminEmail]
    );

    if (tenantCheck.rows.length > 0) {
      return res.status(400).json({ message: "This Email already exists on our system. try to login " });
    }

    const newTenant = await pool.query(
      "INSERT INTO tenants (name, plan) VALUES ($1, $2) RETURNING id",
      [name, "FREE"]
    );


    const tenantId = newTenant.rows[0].id;

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const newUser = await pool.query(
      `INSERT INTO users (tenant_id, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, role`,
      [tenantId, adminEmail, hashedPassword, "ADMIN"]
    );

    const user = newUser.rows[0];

    const token = jwt.sign(
      { userId: user.id, tenantId, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("token", token ,{
      httpOnly : true,
      secure : true,
      sameSite : "strict",
      maxAge : 24 * 60 * 60 * 1000
    })
    res.status(201).json({
      message: "Tenant registered successfully",
      tenant: { id: tenantId, name },
      user
    });
  } catch (error) {
    console.error("Error registering tenant:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
