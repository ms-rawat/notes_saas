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
  const { tenantname,username, adminEmail, adminPassword } = req.body;

  if (!tenantname  || !adminEmail || !username || !adminPassword) {
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
      [tenantname,"FREE"]
    );


    const tenantId = newTenant.rows[0].id;

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const newUser = await pool.query(
      `INSERT INTO users (tenant_id,user_name, email, password_hash, role_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email`,
      [tenantId, username, adminEmail, hashedPassword, 1 ]
    );

 
    const user = newUser.rows[0];
    user.tenantId = tenantId;
    user.roleName = "Admin";
    user.tenantName = tenantname;
    

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
      tenant: { id: tenantId, name: tenantname, plan: "FREE" },
      user
    });
  } catch (error) {
    console.error("Error registering tenant:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
