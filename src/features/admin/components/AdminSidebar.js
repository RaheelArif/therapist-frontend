import React from "react";
import { Layout, Menu, Avatar, Typography } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../../../assets/images/logo-ms.png";

const { Sider } = Layout;
const { Text } = Typography;

const AdminSidebar = () => {
  const navigate = useNavigate();
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
  ];

  return (
    <Sider
      onClick={() => console.log(user)}
      style={{ backgroundColor: "white" }}
    >
      <div className="logo-area-c" onClick={() => navigate("/admin")}>
        <img
          src={logo}
          alt="Logo"
          style={{ cursor: "pointer", width: "100%", height: "auto" }}
        />
      </div>

      <Menu mode="inline" items={items} onClick={({ key }) => navigate(key)} />
    </Sider>
  );
};

export default AdminSidebar;
