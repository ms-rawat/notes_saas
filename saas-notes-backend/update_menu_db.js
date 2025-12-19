const pool = require("./db");

async function updateMenu() {
    try {
        await pool.query(
            "UPDATE menus SET title = 'Issues', path = '/issues' WHERE title = 'Notes' OR path = '/notes'"
        );
        console.log("Menu updated successfully");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

updateMenu();
