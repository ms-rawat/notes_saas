import { BarChart2, FileText, Menu, PlusSquare } from "lucide-react";
import { NavLink } from "react-router";
import UseApi from "../Hooks/UseApi";
import { useEffect } from "react";

const Sidebar = ({ items = [], collapsed, onToggle }) => {

    // getting the menus from backend
    const {data,isPending,error, refetch} = UseApi({
        url : "menu/",
        method: "GET",
        enabled : false,
    })

    useEffect(()=>{
       refetch();
    },[])


  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-60"
      } bg-primary text-text min-h-screen flex flex-col transition-all duration-300 border-r border-border`}
    >
      {/* Toggle button */}
      <div className="flex items-start justify-between p-4 border-b border-border">
        <button
          onClick={onToggle}
          className="p-2 hover:bg-accent/20 rounded-xl transition"
        >
          <Menu size={20} className="text-surface" />
        </button>
      </div>
        <button onClick={()=>refetch()}>fetch menus</button>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 mt-2">
        <NavLink
          to="/create"
          className={({ isActive }) =>
            `flex text-surface items-center gap-3 px-3 py-2 rounded-xl transition ${
              isActive
                ? "bg-primary text-surface font-semibold"
                : "hover:bg-accent/20 "
            }`   
          }
        >
          <PlusSquare size={18} className="text-surface"/>
          {!collapsed && "Create Note"}
        </NavLink>

        <NavLink
          to="/progress"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-xl transition ${
              isActive
                ? "bg-primary text-surface font-semibold"
                : "hover:bg-accent/20 "
            }`
          }
        >
          <BarChart2 size={18} />
          {!collapsed && "Progress"}
        </NavLink>

        <NavLink
          to="/all-notes"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-xl transition ${
              isActive
                ? "bg-primary text-surface font-semibold"
                : "hover:bg-accent/20"
            }`
          }
        >
          <FileText size={18} />
          {!collapsed && "All Notes"}
        </NavLink>

        {/* Render extra items dynamically */}
        {items.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                isActive
                  ? "bg-primary text-surface font-semibold"
                  : "hover:bg-accent/20 "
              }`
            }
          >
            {item.icon && <item.icon size={18} />}
            {!collapsed && item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
