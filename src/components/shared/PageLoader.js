import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const PageLoader = () => (
  <div style={{ 
    height: '100vh', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    background: '#f0f2f5'
  }}>
    <Spin 
      indicator={
        <LoadingOutlined 
          style={{ fontSize: 48 }} 
          spin 
        />
      } 
    />
  </div>
);

export default PageLoader;
