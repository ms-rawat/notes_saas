const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const auth = require("../middleware/auth");
const router = express.Router();
const crypto = require('crypto');
const { sendEmail } = require("../utils/SendEmail");


router.get('/', async (req,res)=>{
  res.status(200).json({message: "Tenant route works"})
});
// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password, tenant } = req.body;
  console.log(req.body)
  try {
    const result = await pool.query(
      "SELECT u.*,t.name as tenant_name FROM users u JOIN tenants t ON u.tenant_id = t.id WHERE u.email = $1 and t.id = $2",
      [email, tenant.id]
    );

    if (result.rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });
    const user = result.rows[0];
    const userRole = await pool.query(
      "SELECT r.role_name FROM roles r WHERE r.role_id = $1",
      [user.role_id]
    );
    user.roleName = userRole.rows[0]?.role_name || "User";
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });
     const userDetails =    {
        userId: user.id,
        tenantId: user.tenant_id,
        role: user.role,
        roleName: user.roleName,
        tenantName : user.tenant_name,
        email: user.email,
      }
    const token = jwt.sign( userDetails,
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

     res.cookie("token",token,{
      httpOnly : true,
      secure : false,
      sameSite : "lax",
      maxAge : 24 * 60 * 60 * 1000
     })
    res.json({ token,userDetails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.post("/forgot-password", async(req,res)=>{
  const {email} = req.body;
try{
  const userResult = await pool.query("SELECT * FROM users WHERE email = $1",[email]);
  
  if(userResult.rows.length === 0)
  {
      return res.status(200).json({ message: "Reset link sent if the email exists" });
  }
  const user = userResult.rows[0];
  console.log(user)
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
  
  await pool.query("Update users set reset_token = $1,  reset_token_expires = $2 where id = $3",[hashToken,tokenExpiry,user.id] )
  
  const resetLink = req.headers.origin+"/reset-password?token=" + resetToken;
  
  // Send email
    await sendEmail   ({
      to: user.email,
      subject: "NotesVerse Password Reset",
      text: `Hi ${user.user_name},\n\nClick the link below to reset your password:\n${resetLink}\n\nIf you didn’t request this, please ignore it.`,
    });

    res.status(200).json({ message: "Password reset link sent!" });

  }
  catch(err){
    console.log(err)
    res.status(500).json({error:err.message})
  }

})

// POST /auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
});


router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  try {
    // 1️⃣ Validate input
    if (!token || !password) {
      return res.status(400).json({ message: "Invalid request." });
    }

    // 2️⃣ Hash the token (we stored hashed one in DB)
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 3️⃣ Find matching user whose token is still valid
    const userResult = await pool.query(
      "SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()",
      [hashedToken]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const user = userResult.rows[0];

    // 4️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Update user password & clear reset token
    await pool.query(
      `UPDATE users 
       SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL 
       WHERE id = $2`,
      [hashedPassword, user.user_id]
    );

    // 6️⃣ Respond
    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
})


// GET /api/me - Get current user from JWT cookie
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.token; 
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authenticated' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('token decoded',decoded)
    const {rows} = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    const user = rows[0];
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      userDetails: {
        UserId: user.id,
        name: user.user_name,
        email: user.email,
        tenantId: user.tenant_id,
        role: user.role_id

      }
    });

  } catch (error) {
    console.error('Auth error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});


router.post("/invite-user", auth, async (req, res) => {
  const { email, role_id } = req.body;
  const tenantId = req.user.tenantId;
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

  await pool.query(
    `INSERT INTO user_invitations (tenant_id, email, role_id, token, expires_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [tenantId, email, role_id, token, expiresAt]
  );

  const inviteLink = `${req.headers.origin}/register-user?token=${token}`;
  await sendEmail({
    to: email,
    subject: "You’ve been invited to join NotesVerse",
    text: `Click here to join your workspace: ${inviteLink}`
  });

  res.json({ success: true, message: "Invitation sent." });
});

router.get("/verify-invite", async (req, res) => {
  const { token } = req.query;
  const { rows } = await pool.query(
    `SELECT * FROM user_invitations WHERE token=$1 AND expires_at > NOW() AND accepted=false`,
    [token]
  );
  if (!rows.length) return res.status(400).json({ message: "Invalid or expired token." });
  res.json({ success: true, email: rows[0].email, tenant_id: rows[0].tenant_id });
});


router.post("/register-invited-user", async (req, res) => {
  const { token, password } = req.body;
  const result = await pool.query(
    `SELECT * FROM user_invitations WHERE token=$1 AND expires_at > NOW() AND accepted=false`,
    [token]
  );
  if (!result.rows.length) return res.status(400).json({ message: "Invalid token" });

  const invite = result.rows[0];
  const hashed = await bcrypt.hash(password, 10);
  await pool.query(
    `INSERT INTO users (email, password_hash, tenant_id, role_id)
     VALUES ($1, $2, $3, $4)`,
    [invite.email, hashed, invite.tenant_id, invite.role_id]
  );
  await pool.query(`UPDATE user_invitations SET accepted=true WHERE id=$1`, [invite.id]);
  res.json({ success: true, message: "User registered successfully." });
});

module.exports = router;

