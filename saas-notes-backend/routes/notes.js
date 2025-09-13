const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

// CREATE note
router.post("/", auth, async (req, res) => {
  const { title, body } = req.body;
  try {
    // Check tenant plan
    const tenantRes = await pool.query("SELECT * FROM tenants WHERE id=$1", [req.user.tenantid]);
    const tenant = tenantRes.rows[0];

    if (tenant.plan === "free") {
      const countRes = await pool.query("SELECT COUNT(*) FROM notes WHERE tenant_id=$1", [tenant.id]);
      if (parseInt(countRes.rows[0].count) >= tenant.note_limit) {
        return res.status(403).json({ error: "Note limit reached. Upgrade to Pro." });
      }
    }

    const result = await pool.query(
      "INSERT INTO notes (tenant_id, owner_id, title, body) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.user.tenantid, req.user.userid, title, body]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all notes
router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM notes WHERE tenant_id=$1", [req.user.tenantid]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE note
router.delete("/:id", auth, async (req, res) => {
  try {
    await pool.query("DELETE FROM notes WHERE id=$1 AND tenant_id=$2", [req.params.id, req.user.tenantid]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
