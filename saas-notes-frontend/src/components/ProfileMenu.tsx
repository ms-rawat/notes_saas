import React, { useState, useRef, useEffect } from "react";
import {
  UserOutlined,
  ProfileOutlined,
  LogoutOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, notification } from "antd";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../store/authSlice";

interface ProfileMenuProps {
  userName?: string;
  userRole?: string;
  avatarUrl?: string;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  userName = "Alex Morgan",
  userRole = "Software Developer",
  avatarUrl,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
 const usersData = useSelector(selectUser)
 console.log(usersData)

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      Cookies.remove("token");
      dispatch(logout());
      notification.success({
        message: "You have been logged out successfully.",
        placement: "bottomRight",
      });
      console.log("logout clicked");
    } catch (error) {
      notification.error({
        message: "Logout failed.",
        placement: "bottomRight",
      });
    } finally {
      setIsOpen(false);
    }
  };

  // ✅ Handle profile click
  const handleProfileClick = () => {
    console.log("Profile clicked");
    // Add profile navigation logic (e.g. navigate('/profile'))
    setIsOpen(false);
  };

  // ✅ Handle notifications click
  const handleNotificationsClick = () => {
    console.log("Notifications clicked");
    // Add notification navigation logic
    setIsOpen(false);
  };

  // ✅ Menu items for Dropdown
  const menuItems = [
    {
      key: "profile",
      label: (
        <button
          onClick={handleProfileClick}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-muted hover:bg-opacity-10 group"
        >
          <ProfileOutlined className="text-lg group-hover:scale-110 transition-transform" />
          <span className="font-medium text-sm">Profile</span>
        </button>
      ),
    },
    {
      key: "notifications",
      label: (
        <button
          onClick={handleNotificationsClick}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-muted hover:bg-opacity-10 group"
        >
          <BellOutlined className="text-lg group-hover:scale-110 transition-transform" />
          <span className="font-medium text-sm">Notifications</span>
        </button>
      ),
    },
    {
      key: "logout",
      label: (
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-red-500/10 group"
        >
          <LogoutOutlined className="text-lg text-red-500 group-hover:scale-110 transition-transform" />
          <span className="font-medium text-sm text-red-500">Logout</span>
        </button>
      ),
    },
  ];

  // ✅ Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Simple reusable glassmorphism wrapper
  const GlassMorph: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div
      className="
        backdrop-blur-xl
        bg-white/10
        rounded-2xl
        transition-all
        duration-300
        hover:shadow-lg
      "
    >
      {children}
    </div>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <Dropdown
        menu={{ items: menuItems }}
        placement="bottomRight"
        open={isOpen}
        onOpenChange={setIsOpen}
        trigger={["click"]}
      >
        <div className="cursor-pointer">
          <GlassMorph>
            <div className="flex items-center gap-3 p-3 rounded-xl">
              <Avatar size={44} src={avatarUrl} icon={<UserOutlined />} />
              <div className="flex flex-col text-textsecondary">
                <span className="font-semibold text-base truncate">{usersData?.name || "john doe"} </span>
                <span className="text-sm opacity-80 truncate">{usersData?.roleName || "User"}</span>
              </div>
            </div>
          </GlassMorph>
        </div>
      </Dropdown>
    </div>
  );
};

export default ProfileMenu;
