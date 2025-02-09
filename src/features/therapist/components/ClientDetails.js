import React, { useState, useEffect } from "react";

import { getAppointments } from "../../../api/appointment";
import {
  Descriptions,
  Row,
  Col,
  Card,
  Typography,
  Space,
  Tooltip,
  Tabs,
  List,
  Tag,
  Avatar,
  message,
  Button,
  Modal,
  Table,
  Spin,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  HomeOutlined,
  GlobalOutlined,
  ReadOutlined,
  HeartOutlined,
  FlagOutlined,
  NumberOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

const { TabPane } = Tabs;

const ClientDetails = ({ appointments, setAppointments, user, record }) => {
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [clientAppointments, setClientAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleClientDetails = async (record) => {
    setSelectedClientId(record.client.id);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedClientId(null);
    setClientAppointments([]);
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      if (selectedClientId) {
        try {
          setLoading(true);
          let params = { clientId: selectedClientId };
          const response = await getAppointments(params);
          setClientAppointments(response);
        } catch (error) {
          message.error("Failed to fetch client appointments");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAppointments();
  }, [selectedClientId]);

  const handleDownload = (url, filename) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(() => message.error("Failed to download file"));
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "fullname",
      key: "fullname",
      render: (text, row) => row.therapist?.user?.fullname,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text, row) => row.therapist?.user?.email,
    },
    {
      title: "Date",
      dataIndex: "startTime",
      key: "startTime",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Time",
      dataIndex: "startTime",
      key: "time",
      render: (text, record) => {
        const start = new Date(record.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const end = new Date(record.endTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        return `${start} - ${end}`;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    // Add other columns as needed
  ];

  const client =
    clientAppointments.length > 0 ? clientAppointments[0].client : null;

  const renderClientInfo = (clientInfo) => {
    if (!clientInfo) return <p>No client information available.</p>;

    return (
      <Card
        title={
          <Title level={4}>
            <UserOutlined /> Client Information
          </Title>
        }
      >
        <Tabs defaultActiveKey="personal">
          <TabPane tab="Personal Details" key="personal">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Card size="small" title="Basic Details">
                  <Space direction="vertical">
                    <Text strong>
                      <UserOutlined /> Full Name:
                    </Text>
                    <Text>{clientInfo.fullName || "N/A"}</Text>
                    <Text strong>
                      <HeartOutlined /> Gender:
                    </Text>
                    <Text>{clientInfo.gender || "N/A"}</Text>
                    <Text strong>
                      <CalendarOutlined /> Date of Birth:
                    </Text>
                    <Text>
                      {clientInfo.dob
                        ? new Date(clientInfo.dob).toLocaleDateString()
                        : "N/A"}
                    </Text>
                  </Space>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Birth Details" key="birth">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Card size="small" title="Birth Information">
                  <Space direction="vertical">
                    <Text strong>
                      <HomeOutlined /> Place of Birth:
                    </Text>
                    <Text>{clientInfo.placeOfBirth || "N/A"}</Text>
                    <Text strong>
                      <NumberOutlined /> Birth Order:
                    </Text>
                    <Text>{clientInfo.birthOrder || "N/A"}</Text>
                    <Text strong>
                      <NumberOutlined /> Siblings Count:
                    </Text>
                    <Text>{clientInfo.siblingsCount || "N/A"}</Text>
                  </Space>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Education & Culture" key="education">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Card size="small" title="Education Details">
                  <Space direction="vertical">
                    <Text strong>
                      <ReadOutlined /> Education:
                    </Text>
                    <Text>{clientInfo.education || "N/A"}</Text>
                    <Text strong>Institute:</Text>
                    <Text>{clientInfo.educationInstitute || "N/A"}</Text>
                    <Text strong>
                      <GlobalOutlined /> Languages:
                    </Text>
                    {clientInfo.everydayLanguage &&
                    clientInfo.everydayLanguage.length > 0 ? (
                      clientInfo.everydayLanguage.map((lang, index) => (
                        <Tag key={index}>{lang}</Tag>
                      ))
                    ) : (
                      <Text>N/A</Text>
                    )}
                  </Space>
                </Card>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Card size="small" title="Religion">
                  <Text strong>
                    <FlagOutlined /> Religion:
                  </Text>
                  <Text>{clientInfo.religion || "N/A"}</Text>
                </Card>
              </Col>
            </Row>
          </TabPane>
          {clientInfo.siblings && clientInfo.siblings.length > 0 && (
            <TabPane tab="Siblings" key="siblings">
              <Card title="Siblings">
                <List
                  dataSource={clientInfo.siblings}
                  renderItem={(sibling) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={sibling.name}
                        description={
                          <Space>
                            <Text>Gender: {sibling.gender}</Text>
                            <Text>Age: {sibling.age}</Text>
                            <Text>Occupation: {sibling.occupation}</Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </TabPane>
          )}
        </Tabs>
      </Card>
    );
  };

  const renderParentInformation = (parentInformation) => {
    if (!parentInformation || parentInformation.length === 0)
      return <p>No parent information available.</p>;

    return (
      <List
        dataSource={parentInformation}
        renderItem={(parent) => (
          <List.Item>
            <Card
              title={parent.relationShip + ": " + parent.name}
              style={{ width: "100%" }}
            >
              <p>Age: {parent.age}</p>
              <p>Place of Birth: {parent.placeOfBirth}</p>
              <p>Occupation: {parent.occupation}</p>
              {/* Add other parent information as needed */}
            </Card>
          </List.Item>
        )}
      />
    );
  };

  const renderComplaints = (complaints) => {
    if (!complaints || complaints.length === 0)
      return <p>No complaints available.</p>;

    return (
      <List
        dataSource={complaints}
        renderItem={(complaint) => (
          <List.Item>
            <Card title={complaint.description} style={{ width: "100%" }}>
              <p>
                Start Date: {new Date(complaint.startDate).toLocaleDateString()}
              </p>
              <p>Expectations: {complaint.expectations}</p>
              {/* Add other complaint information as needed */}
            </Card>
          </List.Item>
        )}
      />
    );
  };

  return (
    <>
      <Button onClick={() => handleClientDetails(record)}>
        Client Details
      </Button>
      <Modal
        key={selectedClientId} // Add the key prop here
        title="Client Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
        ]}
        width={1000}
      >
        {client ? (
          <Tabs defaultActiveKey="1">
            <TabPane tab="General Info" key="1">
              <Card title={client.user?.fullname} style={{ marginBottom: 16 }}>
                <p>Email: {client.user?.email}</p>
                {/* Add other general client details here */}
              </Card>
            </TabPane>

            <TabPane tab="Client Info" key="2">
              {renderClientInfo(client.clientInfo)}
            </TabPane>

            <TabPane tab="Parent Information" key="3">
              {renderParentInformation(client.parentInformation)}
            </TabPane>

            <TabPane tab="Complaints" key="4">
              {renderComplaints(client.complaint)}
            </TabPane>

            <TabPane tab="Documents" key="5">
              <h3>Client Documents:</h3>
              {client.fileUpload && client.fileUpload.length > 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={client.fileUpload}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta title={item.filename} />
                      <Space>
                        <Button
                          type="primary"
                          onClick={() => window.open(item.url, "_blank")}
                        >
                          View
                        </Button>
                        <Button
                          onClick={() =>
                            handleDownload(item.url, item.filename)
                          }
                        >
                          Download
                        </Button>
                      </Space>
                    </List.Item>
                  )}
                />
              ) : (
                <p>No files available for this client.</p>
              )}
            </TabPane>

            <TabPane tab="Appointments" key="6">
              <h3>Client Appointments:</h3>
              {loading ? (
                <div style={{ textAlign: "center" }}>
                  <Spin size="large" />
                </div>
              ) : clientAppointments.length > 0 ? (
                <Table
                  columns={columns}
                  dataSource={clientAppointments}
                  rowKey="id"
                />
              ) : (
                <p>No appointments found for this client.</p>
              )}
            </TabPane>
          </Tabs>
        ) : null}
      </Modal>
    </>
  );
};

export default ClientDetails;
