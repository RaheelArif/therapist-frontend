// features/therapist/TherapistLayout.js
import React from 'react';
import { Layout } from 'antd';
import TherapistHeader from './TherapistHeader';

const { Content } = Layout;

const TherapistLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout>
        <TherapistHeader />
        <Content style={{marginTop:"0px"}} className='admin-layout-content-area'>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default TherapistLayout;