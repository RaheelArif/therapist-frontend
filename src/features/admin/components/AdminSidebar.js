import React from "react";
import { Layout, Menu, Avatar, Typography } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  SettingOutlined, // Added icon for Offline Dates
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../../../assets/images/logo-ms.png";

const { Sider } = Layout;
const { Text } = Typography;

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const items = [
    {
      key: "/admin",
      icon: <UserOutlined />,
      label: "Dashboard",
    },
    {
      key: "/admin/clients",
      icon: <UserOutlined />,
      label: "Clients",
    },
    {
      key: "/admin/therapists",
      icon: <TeamOutlined />,
      label: "Therapists",
    },
    {
      key: "/admin/admins",
      icon: <TeamOutlined />,
      label: "Admins",
    },
    {
      key: "/admin/appointments",
      icon: <CalendarOutlined />,
      label: "Appointments",
    },
    {
      key: "/admin/add-appointment",
      icon: <TeamOutlined />,
      label: "Add Appointment",
    },
    {
      key: "/admin/offline-dates", // NEW ROUTE
      icon: <SettingOutlined />, // Using a settings icon, but choose what's appropriate
      label: "Offline Dates",
    },
  ];

  // Function to find the selected key based on current path
  const getSelectedKey = () => {
    // Check if we're on the exact admin path
    if (location.pathname === "/admin") {
      return ["/admin"];
    }

    // Find the menu item that matches the current path
    const selectedItem = items.find(
      (item) => location.pathname.startsWith(item.key) && item.key !== "/admin"
    );

    return selectedItem ? [selectedItem.key] : ["/admin"];
  };

  return (
    <Sider style={{ backgroundColor: "white" }}>
      <div className="logo-area-c" onClick={() => navigate("/admin")}>
        <img
          src={logo}
          alt="Logo"
          style={{ cursor: "pointer", width: "100%", height: "auto" }}
        />
      </div>

      <Menu
        mode="inline"
        items={items}
        onClick={({ key }) => navigate(key)}
        selectedKeys={getSelectedKey()}
      />
    </Sider>
  );
};

export default AdminSidebar;
