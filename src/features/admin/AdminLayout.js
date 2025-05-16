import React, { useState, useEffect } from 'react';
import { Layout as AntLayout, Drawer, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
import { useLocation } from 'react-router-dom';

const { Content } = AntLayout;

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Track screen width
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
   
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {!isMobile && <AdminSidebar />}

      {isMobile && (
        <>
          <Button
            icon={<MenuOutlined />}
            onClick={() => setVisible(true)}
            style={{ position: 'fixed', top: 16, left: 16, zIndex: 1000 }}
          />
          <Drawer
            placement="left"
            closable={true}
            onClose={() => setVisible(false)}
            open={visible}
            bodyStyle={{ padding: 0 }}
          >
            <AdminSidebar onNavigate={() => setVisible(false)} />
          </Drawer>
        </>
      )}

      <AntLayout>
        <AdminHeader />
        <Content  className={`admin-layout-content-area ${location.pathname ==='/admin/add-appointment' ? " zero-padding-c" :""}`}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default AdminLayout;
