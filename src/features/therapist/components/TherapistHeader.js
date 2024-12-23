// features/therapist/components/TherapistHeader.js
import React from 'react';
import { Layout, Dropdown, Avatar, Space } from 'antd';
import { LogoutOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../auth/authSlice';

const { Header } = Layout;

const TherapistHeader = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

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
            icon={<UserOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          />
          <span>{user?.user?.fullname || 'Therapist'}</span>
          <DownOutlined />
        </Space>
      </Dropdown>
    </Header>
  );
};

export default TherapistHeader;