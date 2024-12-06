import React from 'react';
import { Layout as AntLayout } from 'antd';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';

const { Content } = AntLayout;

const AdminLayout = ({ children }) => {
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <AdminSidebar />
      <AntLayout>
        <AdminHeader />
        <Content style={{ margin: '24px 16px', padding: 24 }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default AdminLayout;