import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Spin } from "antd";
import {
  TeamOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { getUserCounts } from "../../../../api/admin";
import "./dashboard.css";
import CountUp from "react-countup";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    Admin: 0,
    Therapist: 0,
    Client: 0,
  });

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const response = await getUserCounts();
      // Transform the array response into an object
      const countsObject = response.reduce((acc, item) => {
        acc[item.role] = item._count.role;
        return acc;
      }, {});
      setCounts(countsObject);
    } catch (error) {
      console.error("Error fetching counts:", error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Admins",
      value: counts.Admin || 0,
      icon: <TeamOutlined style={{ fontSize: 28, color: "#1890ff" }} />,
      color: "from-blue-50 to-blue-100",
      valueStyle: { color: "#1890ff" },
      description: "System administrators",
    },
    {
      title: "Total Therapists",
      value: counts.Therapist || 0,
      icon: <MedicineBoxOutlined style={{ fontSize: 28, color: "#52c41a" }} />,
      color: "from-green-50 to-green-100",
      valueStyle: { color: "#52c41a" },
      description: "Active therapists",
    },
    {
      title: "Total Clients",
      value: counts.Client || 0,
      icon: <UserOutlined style={{ fontSize: 28, color: "#722ed1" }} />,
      color: "from-purple-50 to-purple-100",
      valueStyle: { color: "#722ed1" },
      description: "Registered clients",
    },
    {
      title: "Total Users",
      value: Object.values(counts).reduce((a, b) => a + b, 0),
      icon: <UsergroupAddOutlined style={{ fontSize: 28, color: "#fa8c16" }} />,
      color: "from-orange-50 to-orange-100",
      valueStyle: { color: "#fa8c16" },
      description: "All platform users",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">
        Dashboard Overview
      </h2>
      <Spin spinning={loading}>
        <Row gutter={[24, 24]}>
          {cards.map((card, index) => (
            <Col key={index} xs={24} sm={12} lg={6}>
              <Card
                hoverable
                className={`h-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                style={{
                  borderRadius: "16px",
                  border: "none",
                  overflow: "hidden",
                }}
                bodyStyle={{ padding: "24px" }}
              >
                <div className="darshboard-cards-c">
                  <div className="p-3 rounded-2xl bg-white shadow-sm">
                    {card.icon}
                  </div>
                  <div className="flex-grow">
                    <CountUp
                      start={0}
                      end={card.value}
                      duration={1.5}
                      separator=","
                      enableScrollSpy={true} 
                      delay={0}
                      style={{
                        ...card.valueStyle,
                        fontSize: "30px",
                        fontWeight: "bold",
                        margin: 0,
                        lineHeight: 1,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {card.title}
                  </h3>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>
    </div>
  );
};

export default DashboardPage;
