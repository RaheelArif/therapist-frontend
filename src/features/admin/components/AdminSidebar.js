import React from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, TeamOutlined, CalendarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo-ms.png";

const { Sider } = Layout;

const AdminSidebar = () => {
  const navigate = useNavigate();

  const items = [
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
      key: "/admin/appointments",
      icon: <TeamOutlined />,
      label: "Appointments",
    },
  ];

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
      />
    </Sider>
  );
};

export default AdminSidebar;
