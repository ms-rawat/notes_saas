const pool = require("./db");

async function checkFixMenus() {
    try {
        const client = await pool.connect();

        console.log("Checking Menus...");
        const menus = await client.query("SELECT * FROM menus");
        console.log("Current Menus:", menus.rows.map(m => `${m.title} (${m.path})`));

        const projectsMenu = menus.rows.find(m => m.path === '/projects');

        if (!projectsMenu) {
            console.log("Projects menu missing! Inserting...");
            const res = await client.query("INSERT INTO menus (title, icon, path, parent_id, order_no) VALUES ('Projects', 'FolderOpen', '/projects', null, 2) RETURNING menu_id");
            const newMenuId = res.rows[0].menu_id;

            console.log("Assigning to Role 1 (Admin)...");
            // Assuming role_id 1 is Admin/Default
            await client.query("INSERT INTO role_menus (role_id, menu_id) VALUES (1, $1) ON CONFLICT DO NOTHING", [newMenuId]);
        } else {
            console.log("Projects menu exists. Checking role assignment...");
            // Check if assigned to role 1
            const assignment = await client.query("SELECT * FROM role_menus WHERE menu_id = $1 AND role_id = 1", [projectsMenu.menu_id]);
            if (assignment.rows.length === 0) {
                console.log("Assigning to Role 1...");
                await client.query("INSERT INTO role_menus (role_id, menu_id) VALUES (1, $1)", [projectsMenu.menu_id]);
            } else {
                console.log("Already assigned to Role 1.");
            }
        }

        console.log("Fix complete.");
        client.release();
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

checkFixMenus();
