const pool = require("./db");

async function removeDashboard() {
    try {
        const client = await pool.connect();
        await client.query("BEGIN");

        // Remove 'User Dashboard' or 'Dashboard' from menus
        // Adjust title check based on what is actually in DB. Assuming 'User Dashboard' based on UserDashboard.jsx title or similar.
        // Likely 'Dashboard' or 'Home' ? Sidebar likely maps /dashboard to a title.
        // Let's delete by path to be safe.
        await client.query("DELETE FROM menus WHERE path = '/dashboard'");

        // Also likely need to clean up role_menus if cascade isn't set, but usually it is or we ignore orphans.
        // Let's safe delete from role_menus first just in case foreign key constraints exist without cascade.
        // Actually standard PG foreign keys restict delete.
        await client.query("DELETE FROM role_menus WHERE menu_id IN (SELECT menu_id FROM menus WHERE path = '/dashboard')");
        await client.query("DELETE FROM menus WHERE path = '/dashboard'");

        await client.query("COMMIT");
        console.log("Dashboard menu removed.");
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

removeDashboard();
