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
        <Content style={{ margin: '24px 16px', padding: 24 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default TherapistLayout;