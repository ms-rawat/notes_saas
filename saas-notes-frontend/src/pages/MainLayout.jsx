import { Outlet } from "react-router"
import { useState } from "react";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {

    const [collapsed, setCollapsed] = useState(false);

    // toggle handler
    const handleToggle = () => {
        setCollapsed((prev) => !prev);
    };
    return (

        <div
            className={`grid min-h-screen bg-bg   transition-all duration-300 
    ${collapsed ? "grid-cols-[64px_1fr]" : "grid-cols-[240px_1fr]"}`}
        >            <span className="h-screen sticky top-0 border-r">
                <Sidebar onToggle={handleToggle} collapsed={collapsed} />

            </span>
            <main className="overflow-y-auto">
                <Outlet />
            </main>
        </div>
    )
}


export default MainLayout