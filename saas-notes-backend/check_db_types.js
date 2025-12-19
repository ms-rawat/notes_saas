const pool = require("./db");

async function checkTypes() {
    try {
        const userRes = await pool.query(
            "SELECT data_type FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'id'"
        );
        const noteRes = await pool.query(
            "SELECT data_type FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'id'"
        );
        console.log("Users ID type:", userRes.rows[0]?.data_type);
        console.log("Notes ID type:", noteRes.rows[0]?.data_type);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkTypes();
