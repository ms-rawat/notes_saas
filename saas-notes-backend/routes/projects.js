const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

// List Projects
router.get("/", auth, async (req, res) => {
    try {
        const { userId } = req.user;
        // Fetch projects where user is owner or manager (or all for now)
        const result = await pool.query(
            `SELECT p.*, u.user_name as manager_name 
       FROM projects p 
       LEFT JOIN users u ON p.manager_id = u.id
       ORDER BY p.project_id DESC`
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Create Project
router.post("/", auth, async (req, res) => {
    try {
        const { name, description, project_key, manager_id } = req.body;
        const { userId } = req.user;

        if (!name || !project_key) {
            return res.status(400).json({ error: "Name and Key are required" });
        }

        const { rows } = await pool.query(
            `INSERT INTO projects (name, description, project_key, manager_id, owner_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [name, description, project_key.toUpperCase(), manager_id || userId, userId]
        );

        res.status(201).json(rows[0]);
    } catch (err) {
        if (err.code === '23505') return res.status(400).json({ error: "Project key must be unique" });
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Update Project
router.put("/", auth, async (req, res) => {
    try {
        const { project_id, name, description, manager_id, status } = req.body;

        const result = await pool.query(
            `UPDATE projects 
         SET name = COALESCE($1, name),
             description = COALESCE($2, description),
             manager_id = COALESCE($3, manager_id),
             status = COALESCE($4, status)
         WHERE project_id = $5
         RETURNING *`,
            [name, description, manager_id, status, project_id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: "Project not found" });
        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.delete("/", auth, async (req, res) => {
    try {
        const { project_id } = req.body;
        await pool.query("DELETE FROM projects WHERE project_id = $1", [project_id]);
        res.json({ message: "Project deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
