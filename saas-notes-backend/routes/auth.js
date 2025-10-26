const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const auth = require("../middleware/auth");
const router = express.Router();
const crypto = require('crypto');


router.get('/', async (req,res)=>{
  res.status(200).json({message: "Tenant route works"})
});
// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT u.* FROM users u JOIN tenants t ON u.tenant_id = t.id WHERE u.email = $1",
      [email]
    );

    if (result.rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });
    const user = result.rows[0];

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      {
        userId: user.id,
        tenantId: user.tenant_id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

     res.cookie("token",token,{
      httpOnly : true,
      secure : false,
      sameSite : "lax",
      maxAge : 24 * 60 * 60 * 1000

     })
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /auth/signup
router.post("/signup", async (req, res) => {
  const { name, email, password, tenant_id, role } = req.body;

  try {
    // Check if user already exists
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert new user
    const insertResult = await pool.query(
      `INSERT INTO users (name, email, password_hash, tenant_id, role) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, tenant_id, role`,
      [name, email, passwordHash, tenant_id, role || "USER"]
    );

    const newUser = insertResult.rows[0];

    // Get tenant slug
    const tenantRes = await pool.query("SELECT slug FROM tenants WHERE id = $1", [tenant_id]);
    const tenantSlug = tenantRes.rows[0]?.slug;

    // Create token
    const token = jwt.sign(
      {
        userId: newUser.id,
        tenantId: newUser.tenant_id,
        tenantSlug,
        role: newUser.role,
        email: newUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/forgot-password", async(req,res)=>{
  const {email} = req.body;
try{
  const userResult = await pool.query("SELECT id FROM users WHERE email = $1",[email]);
  
  console.log(userResult)
  if(userResult.rows.length === 0)
  {
      return res.status(200).json({ message: "Reset link sent if the email exists" });
  }

  const user = userResult.rows[0];
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
  
  await pool.query("Update users set reset_token = $1,  reset_token_expires = $2 where id = $3",[hashToken,tokenExpiry,user.id] )
  
  const resetLink = "/rest-password?token=" + resetToken;
  
  // Send email
    await sendEmail({
      to: user.email,
      subject: "NotesVerse Password Reset",
      text: `Hi ${user.name},\n\nClick the link below to reset your password:\n${resetLink}\n\nIf you didn’t request this, please ignore it.`,
    });

    res.status(200).json({ message: "Password reset link sent!" });

  }
  catch(err){
    console.log(err)
    res.status(500).json({error:err.message})
  }

})

module.exports = router;
