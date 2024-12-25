import React from 'react';
import { Layout, Dropdown, Avatar, Space } from 'antd';
import { LogoutOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../auth/authSlice';

const { Header } = Layout;

const TherapistHeader = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Get profile picture if user is a therapist
  const profilePicture = user?.user?.therapist?.profilePicture;
  const fullName = user?.user?.fullname || 'Therapist';

  const items = [
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: () => dispatch(logout())
    },
  ];

  return (
    <Header 
      style={{
        background: '#fff',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
      }}
    >
      <Dropdown menu={{ items }} placement="bottomRight">
        <Space className="cursor-pointer">
          <Avatar 
            icon={!profilePicture && <UserOutlined />}
            src={profilePicture}
            style={{ 
              backgroundColor: !profilePicture ? '#1890ff' : 'transparent',
              width: 32,
              height: 32,
              objectFit: 'cover'
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