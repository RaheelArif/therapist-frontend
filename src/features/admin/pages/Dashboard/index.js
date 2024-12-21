import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin } from 'antd';
import {
  TeamOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { getAllUsers } from '../../../../api/admin';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    admins: 0,
    therapists: 0,
    clients: 0,
    totalUsers: 0
  });

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const [adminsData, allUsersData] = await Promise.all([

        getAllUsers()
      ]);
      
      setCounts({
        admins: adminsData.length || 0,
        therapists: allUsersData.filter(user => user.role === 'therapist').length || 0,
        clients: allUsersData.filter(user => user.role === 'client').length || 0,
        totalUsers: allUsersData.length || 0
      });
    } catch (error) {
      console.error('Error fetching counts:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Total Admins',
      value: counts.admins,
      icon: <TeamOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      color: '#e6f7ff',
      valueStyle: { color: '#1890ff' }
    },
    {
      title: 'Total Therapists',
      value: counts.therapists,
      icon: <MedicineBoxOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      color: '#f6ffed',
      valueStyle: { color: '#52c41a' }
    },
    {
      title: 'Total Clients',
      value: counts.clients,
      icon: <UserOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
      color: '#f9f0ff',
      valueStyle: { color: '#722ed1' }
    },
    {
      title: 'Total Users',
      value: counts.totalUsers,
      icon: <UsergroupAddOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
      color: '#fff7e6',
      valueStyle: { color: '#fa8c16' }
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <Spin spinning={loading}>
        <Row gutter={[24, 24]}>
          {cards.map((card, index) => (
            <Col key={index} xs={24} sm={12} lg={6}>
              <Card
                hoverable
                className="h-full"
                style={{
                  backgroundColor: card.color,
                  borderRadius: '12px',
                  border: '1px solid #f0f0f0'
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full" style={{ backgroundColor: 'white' }}>
                    {card.icon}
                  </div>
                  <Statistic
                    value={card.value}
                    valueStyle={card.valueStyle}
                    prefix={null}
                  />
                </div>
                <div className="text-base font-medium">{card.title}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>
    </div>
  );
};

export default DashboardPage;