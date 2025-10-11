const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");




router.get("/stats",auth, async (req, res) => {
  try {

    console.log(req.user)
    const {rows} = await pool.query("select count(*) from notes where owner_id = $1", [req.user.userId])
    console.log(rows)
    res.status(200).json({count:rows[0].count})
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }

})

router.get("/recent", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT n.id, n.title, n.created_at, c.name AS category_name
       FROM notes n join categories c on n.category_id = c.category_id
       WHERE n.owner_id = $1
       ORDER BY n.created_at DESC
       LIMIT 3;`,
      [userId]
    );

    res.status(200).json({
      success: true,
      count: result.rowCount,
      data: result.rows,
    });
  } catch (err) {
    console.error("Error fetching recent notes:", err);
    res.status(500).json({ error: "Failed to fetch recent notes" });
  }
});

//create note
router.post("/", auth, async (req, res) => {
  try {
    const { title, body, category_id } = req.body;
    const { userId: owner_id } = req.user;
    const result = await pool.query(
      "INSERT INTO notes (owner_id, title, body, category_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [owner_id, title, body, category_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/", async (req, res) => {
  try {
    const { owner_id, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    let baseQuery = "FROM notes";
    const params = [];

    // Apply filter if owner_id is provided
    if (owner_id) {
      baseQuery += " WHERE owner_id = $1";
      params.push(owner_id);
    }

    // Query to get total count
    const countQuery = `SELECT COUNT(*) AS total ${baseQuery}`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total, 10);

    // Query to get paginated data
    const dataQuery = `
      SELECT * ${baseQuery}
      ORDER BY created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2};
    `;
    const dataParams = [...params, limitNum, offset];
    const dataResult = await pool.query(dataQuery, dataParams);

    res.json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data: dataResult.rows,
    });
  } catch (err) {
    console.error("Pagination error:", err.message);
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
