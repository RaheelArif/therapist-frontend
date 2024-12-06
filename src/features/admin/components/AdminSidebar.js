import React from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
// import logo from "../../../assets/images/MS high res.pdf";

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
  ];

  return (
    <Sider>
      {/* <embed
        src={logo}
        type="application/pdf"
        frameBorder="0"
        scrolling="auto"
     
        width="100%"
      ></embed> */}

      <div
        className="logo"
        style={{
          height: 32,
          margin: 16,
          background: "rgba(255, 255, 255, 0.2)",
        }}
      />
      <Menu
        theme="dark"
        mode="inline"
        items={items}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default AdminSidebar;
