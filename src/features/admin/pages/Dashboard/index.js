import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin } from 'antd';
import { 
  TeamOutlined, 
  UserOutlined, 
  MedicineBoxOutlined
} from '@ant-design/icons';
import { getClients } from '../../../../api/client';
import { getTherapists } from '../../../../api/therapist';
import { getAdmins } from '../../../../api/admin';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    admins: 0,
    therapists: 0,
    clients: 0
  });

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const [clients, therapists, admins] = await Promise.all([
        getClients(),
        getTherapists(),
        getAdmins()
      ]);

      setCounts({
        admins: admins?.length || 0,
        therapists: therapists?.length || 0,
        clients: clients?.length || 0
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
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <Spin spinning={loading}>
        <Row gutter={[24, 24]}>
          {cards.map((card, index) => (
            <Col key={index} xs={24} sm={12} lg={8}>
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