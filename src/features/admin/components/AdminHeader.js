import React from 'react';
import { Layout, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { logout } from '../../auth/authSlice';

const { Header } = Layout;

const AdminHeader = () => {
  const dispatch = useDispatch();

  return (
    <Header style={{ background: '#fff', padding: '0 24px' }}>
      <div style={{ float: 'right' }}>
        <Button 
          icon={<LogoutOutlined />} 
          onClick={() => dispatch(logout())}
        >
          Logout
        </Button>
      </div>
    </Header>
  );
};

export default AdminHeader;