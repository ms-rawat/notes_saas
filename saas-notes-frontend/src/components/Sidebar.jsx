import { Menu } from "lucide-react";
import { DynamicIcon } from 'lucide-react/dynamic';

import { NavLink } from "react-router";
import UseApi from "../Hooks/UseApi";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const Sidebar = ({ items = [], collapsed, onToggle }) => {
  const [Menus, setMenus] = useState([]);
  // getting the menus from backend
  const { data, isPending, error, refetch } = UseApi({
    url: "menu/",
    method: "GET",
    enabled: false,
  })

  console.log(data)

  useEffect(() => {
    refetch();
  }, [])

  useEffect(() => {
    if (data) {
      setMenus(data.data);
    }
  }, [data])

  return (
    <aside
      className={`${collapsed ? "w-16" : "w-60"
        } bg-bg text-text min-h-screen  flex flex-col transition-all duration-300 border-r border-border`}
    >
      {/* Toggle button */}
      <div className="flex items-start justify-between p-4 border-b border-border">
        <button
          onClick={onToggle}
          className="p-2 hover:bg-accent/20 rounded-xl transition"
        >
          <Menu size={20} className="text-text" />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 mt-2">


        {/* Render extra items dynamically */}
        {isPending && <div className="p-4 text-sm text-center">Loading...</div>}
        {error && <div className="p-4 text-sm text-center text-muted">Error loading menus</div>}


        {Menus?.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `flex text-text items-center gap-3 px-3 py-2 rounded-xl transition ${isActive
                ? "bg-surface text-text font-semibold"
                : "hover:bg-accent/20 "
              }`
            }
          >
            {item.icon && <DynamicIcon name={item.icon} size={18} />}
            {item.title}
          </NavLink>
        ))}
      </nav>

      <div className="fixed bottom-1 left-2 mx-auto p-1" >      <ThemeToggle />
      </div>
    </aside>
  );
};

export default Sidebar;
