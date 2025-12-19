import { LogOut, Menu, User2 } from "lucide-react";
import { DynamicIcon } from 'lucide-react/dynamic';

import { NavLink, useNavigate, useNavigation } from "react-router";
import UseApi from "../../Hooks/UseApi";
import { useEffect, useState } from "react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { ThemeSwitcher } from "../ui/ThemeSwithcher";
import ProfileMenu from "../ProfileMenu";
import { notification } from "antd";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";

const Sidebar = ({ items = [], collapsed, onToggle }) => {
  const [Menus, setMenus] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate()

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
  const { mutate: logoutMutation } = UseApi({ url: 'auth/logout', method: 'POST', credentials: 'include' })
  const handleLogout = async () => {
    try {
      Cookies.remove("token");
      logoutMutation()
      dispatch(logout());

      notification.success({
        message: "You have been logged out successfully.",
        placement: "bottomRight",
      });
      navigate('/login')
      console.log("logout clicked");
    } catch (error) {
      console.log(error)
      notification.error({
        message: "Logout failed.",
        placement: "bottomRight",
      });
    }
  };

  return (
    <aside
      className={`${collapsed ? "w-16" : "w-60"} 
       min-h-screen flex flex-col transition-all  duration-300  sidebar`}
    >
      {/* Toggle + Logo */}
      <div className={`flex items-center  px-3 r relative border-b border-border py-3 ${collapsed ? "justify-center" : "justify-start"}`}>
        {/* Left Toggle Button */}
        <button
          onClick={onToggle}
          className=" flex items-center justify-center hover:bg-accent/20 rounded-xl transition"
        >
          <Menu size={20} className="text-textprimary" />

        </button>

        {/* Center Logo */}
        {!collapsed && (
          <h2 className="LogoText text-xl ms-4 font-semibold tracking-wide transition-opacity text-textprimary duration-300">
            NotesVerse
          </h2>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 mt-2">
        {isPending && <div className="p-4 text-sm text-center">Loading...</div>}
        {error && (
          <div className="p-4 text-sm text-center ">
            Error loading menus
          </div>
        )}

        {Menus?.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? "justify-center px-3" : "justify-start px-3"
              } gap-3 py-2 rounded-xl transition-all duration-200 ${isActive ? "font-semibold" : "hover:bg-hover"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {item.icon && (
                  <DynamicIcon
                    name={item.icon}
                    size={18}
                    className="shrink-0 text-textprimary"
                    style={{ fill: isActive ? "var(--color-text)" : "none" }}
                  />
                )}
                {!collapsed && (
                  <span
                    className={`truncate ${isActive ? "text-textprimary" : "text-textsecondary"
                      }`}
                  >
                    {item.title}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}

      </nav>
      {/* Theme Switcher */}
      <div className="mt-auto mb-2 px-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-accent/20"
        >
          <LogOut className="text-textprimary" />
          {!collapsed && <span className="truncate text-textsecondary">Logout</span>}
        </button>
        <ThemeSwitcher />
      </div>
    </aside>
  );

};

export default Sidebar;
