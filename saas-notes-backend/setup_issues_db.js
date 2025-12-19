const pool = require("./db");

async function setupDB() {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        console.log("Alter notes table...");
        await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notes' AND column_name='status') THEN
          ALTER TABLE notes ADD COLUMN status VARCHAR(50) DEFAULT 'TODO';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notes' AND column_name='priority') THEN
          ALTER TABLE notes ADD COLUMN priority VARCHAR(50) DEFAULT 'MEDIUM';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notes' AND column_name='type') THEN
          ALTER TABLE notes ADD COLUMN type VARCHAR(50) DEFAULT 'TASK';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notes' AND column_name='assigned_to') THEN
          ALTER TABLE notes ADD COLUMN assigned_to INTEGER REFERENCES users(id);
        END IF;
      END
      $$;
    `);

        console.log("Create comments table...");
        await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        issue_id INTEGER REFERENCES notes(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

        await client.query("COMMIT");
        console.log("Database Setup Complete!");
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Error setting up DB:", err);
    } finally {
        client.release();
        pool.end();
    }
}

setupDB();
