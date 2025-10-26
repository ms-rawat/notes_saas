import React from "react";
import { Dropdown, Button } from "antd";
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { EllipsisVertical } from "lucide-react";

/**
 * 🌟 ThreeDotMenu Component (Advanced)
 *
 * ✅ Reusable across tables, cards, modals
 * ✅ Supports icons per item (auto or custom)
 * ✅ Handles onClick safely
 * ✅ Memoized for performance
 * ✅ Prevents bubbling in tables
 *
 * @param {Object[]} items - menu items [{ key, label, icon, onClick, danger }]
 * @param {React.ReactNode} icon - menu trigger icon
 * @param {string} placement - dropdown placement
 * @param {string} type - button type
 * @param {string} size - button size
 * @param {Object} buttonStyle - custom button styles
 */

const ThreeDotMenu = ({
  items = [],
  icon = <EllipsisVertical color="var(--color-text)" />,
  placement = "bottomRight",
  type = "text",
  size = "middle",
  buttonStyle = {},
}) => {
  // Helper to attach default icons when not provided
  const attachDefaultIcons = (item) => {
    if (item.icon) return item;
    switch (item.key?.toLowerCase()) {
      case "edit":
        return { ...item, icon: <EditOutlined /> };
      case "delete":
        return { ...item, icon: <DeleteOutlined /> };
      case "view":
        return { ...item, icon: <EyeOutlined /> };
      case "settings":
        return { ...item, icon: <SettingOutlined /> };
      default:
        return item;
    }
  };

  const safeItems = Array.isArray(items)
    ? items.map((i) => attachDefaultIcons(i))
    : [];

  return (
    <Dropdown
      menu={{ items: safeItems }}
      placement={placement}
      trigger={["click"]}
      arrow
    >
      <Button
        type={type}
        icon={icon}
        size={size}
        style={{
          border: "none",
          boxShadow: "none",
          ...buttonStyle,
        }}
        onClick={(e) => e.stopPropagation()} // prevent table/card click bubbling
      />
    </Dropdown>
  );
};

export default React.memo(ThreeDotMenu);
