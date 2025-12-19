import { Outlet, useLocation } from "react-router"
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

const MainLayout = () => {

    const [collapsed, setCollapsed] = useState(false);
    const [HideSidebar, setHideSidebar] = useState(false);
    const location = useLocation();

    useEffect(() => {
        console.log(location.pathname === '/')
        if (location.pathname === '/') {
            setHideSidebar(true)
        } else {
            setHideSidebar(false)
        }
    }, [])

    // toggle handler
    const handleToggle = () => {
        setCollapsed((prev) => !prev);
    };


    return (

        <div
            className={`grid min-h-screen bg-bg  transition-all duration-300 glass-panel
                ${HideSidebar ? "grid-cols-[1fr]" : collapsed ? "grid-cols-[64px_1fr]" : "grid-cols-[240px_1fr]"}
            `}
        >          {!HideSidebar && <span className="h-screen sticky top-0 border-r">
            <Sidebar onToggle={handleToggle} collapsed={collapsed} />

        </span>}
            <main className="overflow-y-auto">
                <Outlet />
            </main>
        </div>
    )
}


export default MainLayout