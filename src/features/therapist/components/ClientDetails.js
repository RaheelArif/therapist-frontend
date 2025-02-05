import React, { useState, useEffect } from "react";
import { Button, message, Modal, Spin, Table, Card, List, Space } from "antd";
import { getAppointments } from "../../../api/appointment";
import { useSelector } from "react-redux";

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
    setSelectedClientId(null)
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
        render: (text , row) => row.therapist?.user?.fullname,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        render: (text , row) => row.therapist?.user?.email,
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

  const client = clientAppointments.length > 0 ? clientAppointments[0].client : null;

  return (
    <>
      <Button  onClick={() => handleClientDetails(record)}>
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
        width={800}
      >
        {client ? (
          <Card title={client.user?.fullname} style={{ marginBottom: 16 }}>
            <p>Email: {client.user?.email}</p>
            {/* Display other client details here */}
          </Card>
        ) : null}

        <h3>Client Documents:</h3>
        {client ? (
          client.fileUpload && client.fileUpload.length > 0 ? (
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
                    <Button onClick={() => handleDownload(item.url, item.filename)}>
                      Download
                    </Button>
                  </Space>
                </List.Item>
              )}
            />
          ) : (
            <p>No files available for this client.</p>
          )
        ) : null}

        <h3>Client Appointments:</h3>
        {loading ? (
          <div style={{ textAlign: "center" }}>
            <Spin size="large" />
          </div>
        ) : clientAppointments.length > 0 ? (
          <Table columns={columns} dataSource={clientAppointments} rowKey="id" />
        ) : (
          <p>No appointments found for this client.</p>
        )}
      </Modal>
    </>
  );
};

export default ClientDetails;