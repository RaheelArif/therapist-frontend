import React, { useEffect, useState } from "react";
import { Table, Button, Space, Modal, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import ClientForm from "./components/ClientForm";
import { getClients, createClient } from "../../../../api/client";

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await getClients();
      setClients(data);
    } catch (error) {
      message.error("Failed to fetch clients");
    }
  };

  const handleAddClient = async (values) => {
    try {
      setLoading(true);
      await createClient(values);
      message.success("Client created successfully");
      setModalVisible(false);
      fetchClients();
    } catch (error) {
      message.error("Failed to create client");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: ["user", "fullname"],
      key: "fullname",
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: "Created At",
      dataIndex: ["user", "createdAt"],
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            // onClick={() => handleEdit(record.id)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            // onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2>Clients Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Add New Client
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={clients}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={loading}
      />

      <Modal
        title="Add New Client"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <ClientForm onFinish={handleAddClient} loading={loading} />
      </Modal>
    </div>
  );
};

export default ClientsPage;
