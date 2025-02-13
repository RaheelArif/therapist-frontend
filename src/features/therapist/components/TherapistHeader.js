import React, { useState, useEffect } from "react";
import { Layout, Dropdown, Avatar, Space, Spin, Tooltip, message } from "antd"; //Import message
import {
  LogoutOutlined,
  UserOutlined,
  DownOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../auth/authSlice";
import { updateTherapistProfile } from "../../auth/authSlice";
import { updateTherapist } from "../../../api/therapist";

const { Header } = Layout;

const TherapistHeader = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isOnline, setIsOnline] = useState(user?.user?.therapist?.isOnline);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const profilePicture = user?.user?.therapist?.profilePicture;
  const fullName = user?.user?.fullname || "Therapist";
  const therapistId = user?.user?.therapist?.id;

  useEffect(() => {
    setIsOnline(user?.user?.therapist?.isOnline || false);
  }, [user]);

  const handleOnlineStatusChange = async (checked) => {
    setIsLoading(true); // Start loading
    try {
      await updateTherapist(therapistId, { isOnline: checked });
      dispatch(
        updateTherapistProfile({
          therapistId: therapistId,
          updatedData: { isOnline: checked },
        })
      );
      setIsOnline(checked);
      message.success(`Status updated to ${checked ? "Online" : "Offline"}`); // success message
    } catch (error) {
      console.error("Error updating online status:", error);
      setIsOnline(!checked);
      message.error("Failed to update online status."); // error message
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const items = [
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: () => dispatch(logout()),
    },
  ];

  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 24px",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      {user ? (
        <Space>
          {isLoading ? (
            <Spin size="small" />
          ) : (
            <Tooltip title={isOnline ? "Go Offline" : "Go Online"}>
              <button
                onClick={() => handleOnlineStatusChange(!isOnline)}
                style={{
                  background: isOnline ? "#52c41a" : "#f5222d",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  marginRight: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                }}
                disabled={isLoading}
              >
                {isOnline ? (
                  <>
                    <WifiOutlined /> Online
                  </>
                ) : (
                  <>Offline</>
                )}
              </button>
            </Tooltip>
          )}
        </Space>
      ) : null}
      <Dropdown menu={{ items }} placement="bottomRight">
        <Space className="cursor-pointer">
          <Avatar
            icon={!profilePicture && <UserOutlined />}
            src={profilePicture}
            style={{
              backgroundColor: !profilePicture ? "#1890ff" : "transparent",
              width: 32,
              height: 32,
              objectFit: "cover",
            }}
          />
          <span>{fullName}</span>
          <DownOutlined />
        </Space>
      </Dropdown>
    </Header>
  );
};

export default TherapistHeader;
