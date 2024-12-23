import React, { useState } from "react";
import {
  Card,
  Descriptions,
  Avatar,
  Divider,
  Button,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";


const Profile = () => {

  const { user } = useSelector((state) => state.auth);


 

  return (
    <div className="p-6">
      <Card className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <Avatar
            size={100}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#1890ff" }}
          />
          <div className="flex items-center justify-center mt-4 mb-1 gap-2">
            <h2 className="text-2xl font-bold">{user?.user?.fullname}</h2>
            
          </div>
          <p className="text-gray-500">{user?.user?.role}</p>
        </div>

        <Divider />

        <Descriptions
          bordered
          column={1}
          labelStyle={{ fontWeight: "bold", width: "200px" }}
        >
          <Descriptions.Item label="Email">
            {user?.user?.email}
          </Descriptions.Item>
       
        </Descriptions>

      </Card>

    </div>
  );
};

export default Profile;
