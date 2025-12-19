const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

// Stats
router.get("/stats", auth, async (req, res) => {
  try {
    const { userId } = req.user;
    const { rows } = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE status = 'TODO') AS todo,
        COUNT(*) FILTER (WHERE status = 'IN_PROGRESS') AS in_progress,
        COUNT(*) FILTER (WHERE status = 'DONE') AS done,
        COUNT(*) AS total
       FROM notes WHERE owner_id = $1`,
      [userId]
    );
    res.status(200).json(rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// Recent Issues
router.get("/recent", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await pool.query(
      `SELECT n.id, n.title, n.created_at, n.status, n.priority, p.name AS project_name
       FROM notes n 
       LEFT JOIN projects p on n.project_id = p.project_id
       WHERE n.owner_id = $1
       ORDER BY n.created_at DESC
       LIMIT 5;`,
      [userId]
    );

    res.status(200).json({
      success: true,
      count: result.rowCount,
      data: result.rows,
    });
  } catch (err) {
    console.error("Error fetching recent issues:", err);
    res.status(500).json({ error: "Failed to fetch recent issues" });
  }
});

// Create Issue
router.post("/", auth, async (req, res) => {
  const { id, title, body, project_id, status, priority, type, assigned_to } = req.body;
  // Fallback for frontend sending category_id
  const final_project_id = project_id || req.body.category_id;
  const { userId: owner_id } = req.user;

  try {
    if (!title?.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const query = id
      ? {
        text: `
            UPDATE notes 
            SET title = $1, body = $2, project_id = $3, status = $4, priority = $5, type = $6, assigned_to = $7, updated_at = NOW()
            WHERE id = $8 AND owner_id = $9
            RETURNING *;
          `,
        values: [title, body || "", final_project_id || null, status || 'TODO', priority || 'MEDIUM', type || 'TASK', assigned_to || null, id, owner_id],
      }
      : {
        text: `
            INSERT INTO notes (owner_id, title, body, project_id, status, priority, type, assigned_to)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
          `,
        values: [owner_id, title, body || "", final_project_id || null, status || 'TODO', priority || 'MEDIUM', type || 'TASK', assigned_to || null],
      };

    const { rows, rowCount } = await pool.query(query);

    if (id && rowCount === 0)
      return res.status(404).json({ error: "Issue not found or not authorized" });

    res.status(id ? 200 : 201).json({
      message: id ? "Issue updated successfully" : "Issue created successfully",
      issue: rows[0],
    });
  } catch (err) {
    console.error("❌ Issue save failed:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch Issues (Paginated & Filtered)
router.post("/fetch", auth, async (req, res) => {
  try {
    const { owner_id, page = 1, limit = 10, status, priority, search, project_id } = req.body;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    let baseQuery = "FROM notes n LEFT JOIN users u ON n.assigned_to = u.id";
    const params = [];
    let whereClauses = [];

    if (owner_id) {
      whereClauses.push(`n.owner_id = $${params.length + 1}`);
      params.push(owner_id);
    }
    if (status) {
      whereClauses.push(`n.status = $${params.length + 1}`);
      params.push(status);
    }
    if (priority) {
      whereClauses.push(`n.priority = $${params.length + 1}`);
      params.push(priority);
    }
    if (project_id) {
      whereClauses.push(`n.project_id = $${params.length + 1}`);
      params.push(project_id);
    }
    if (search) {
      whereClauses.push(`n.title ILIKE $${params.length + 1}`);
      params.push(`%${search}%`);
    }

    if (whereClauses.length > 0) {
      baseQuery += " WHERE " + whereClauses.join(" AND ");
    }

    // Query to get total count
    const countQuery = `SELECT COUNT(*) AS total ${baseQuery}`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total, 10);

    // Query to get paginated data
    const dataQuery = `
      SELECT n.*, u.user_name as assignee_name, u.email as assignee_email 
      ${baseQuery}
      ORDER BY n.created_at DESC
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
    console.error("Pagination error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get Single Issue
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT n.*, u.user_name as assignee_name 
      FROM notes n 
      LEFT JOIN users u ON n.assigned_to = u.id
      WHERE n.id = $1
    `, [id]);

    if (result.rows.length === 0) return res.status(404).json({ error: "Issue not found" });

    // Fetch comments
    const commentsResult = await pool.query(`
      SELECT c.*, u.user_name, u.email 
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.issue_id = $1
      ORDER BY c.created_at ASC
    `, [id]);

    res.json({ ...result.rows[0], comments: commentsResult.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Add Comment
router.post("/:id/comments", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const { userId } = req.user;

    if (!content) return res.status(400).json({ error: "Content is required" });

    const result = await pool.query(
      "INSERT INTO comments (issue_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
      [id, userId, content]
    );

    const filledComment = await pool.query(
      "SELECT c.*, u.user_name FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = $1",
      [result.rows[0].id]
    );

    res.status(201).json(filledComment.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update PUT (Generic update - used by drag & drop)
router.put("/", auth, async (req, res) => {
  try {
    const { id, title, body, project_id, category_id, owner_id, status, priority, assigned_to } = req.body;
    // Fallback for frontend sending category_id
    const final_project_id = project_id || category_id;

    if (!id) {
      return res.status(400).json({ error: "Issue ID is required" });
    }

    const result = await pool.query(
      `UPDATE notes 
       SET title = COALESCE($1, title), 
           body = COALESCE($2, body), 
           project_id = COALESCE($3, project_id), 
           status = COALESCE($4, status), 
           priority = COALESCE($5, priority), 
           assigned_to = COALESCE($6, assigned_to),
           updated_at = NOW()
       WHERE id = $7 AND owner_id = $8
       RETURNING *`,
      [title, body, final_project_id, status, priority, assigned_to, id, owner_id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Note not found or not authorized" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/", auth, async (req, res) => {
  try {
    const { id } = req.body;
    const result = await pool.query("DELETE FROM notes WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) return res.status(404).json({ error: "Note not found" });

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
