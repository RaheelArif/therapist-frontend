import React, { useState, useEffect } from "react";
import { Layout, Dropdown, Avatar, Space, Switch } from "antd";
import { LogoutOutlined, UserOutlined, DownOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../auth/authSlice";
// import { updateTherapistProfile } from "../../auth/authSlice"; //Import updateTherapistProfile to update user information inside redux
import { updateTherapist } from "../../../api/therapist"; //Import updateTherapist api.

const { Header } = Layout;

const TherapistHeader = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  // Initialize isOnline state from the user object
  const [isOnline, setIsOnline] = useState(user?.user?.therapist?.isOnline);

  // Get profile picture if user is a therapist
  const profilePicture = user?.user?.therapist?.profilePicture;
  const fullName = user?.user?.fullname || "Therapist";

  //Extract therapist id from user profile
  const therapistId = user?.user?.therapist?.id;

  // Use useEffect to update local state when user object changes
  useEffect(() => {
    setIsOnline(user?.user?.therapist?.isOnline || false);
  }, [user]);

  const handleOnlineStatusChange = async (checked) => {
    try {
      // Call the API to update the isOnline status
      await updateTherapist(therapistId, { isOnline: checked });
      // Dispatch action to update redux state
      // dispatch(
      //   updateTherapistProfile({
      //     therapistId: therapistId,
      //     updatedData: { isOnline: checked },
      //   })
      // );
      setIsOnline(checked); // Update local state immediately for responsiveness
    } catch (error) {
      console.error("Error updating online status:", error);
      // Revert the switch if there's an error
      setIsOnline(!checked); // Revert to previous state
      // Optionally display an error message to the user
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
          <Switch checked={isOnline} onChange={handleOnlineStatusChange} />
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
