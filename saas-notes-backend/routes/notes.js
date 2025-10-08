const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");


router.post("/",auth, async (req, res) => {
  try {
    const {  title, body } = req.body;
    const {userId : owner_id} = req.user;
    const result = await pool.query(
      "INSERT INTO notes (owner_id, title, body) VALUES ($1, $2, $3) RETURNING *",
      [owner_id, title, body]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/", async (req, res) => {
  try {
    const { owner_id } = req.query;
    let result;

    if (owner_id) {
      result = await pool.query("SELECT * FROM notes WHERE owner_id = $1", [owner_id]);
    } else {
      result = await pool.query("SELECT * FROM notes");
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM notes WHERE id = $1", [id]);

    if (result.rows.length === 0) return res.status(404).json({ error: "Note not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;

    const result = await pool.query(
      "UPDATE notes SET title = $1, body = $2 WHERE id = $3 RETURNING *",
      [title, body, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Note not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM notes WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) return res.status(404).json({ error: "Note not found" });

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
