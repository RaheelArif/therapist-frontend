// pages/Admins/index.js
import React, { useEffect, useState } from "react";
import { Table, Button, Space, Modal, Form, Input, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { getAdmins, createAdmin } from "../../../../api/admin";

const AdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const data = await getAdmins();
      setAdmins(data);
    } catch (error) {
      message.error("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (values) => {
    try {
      setLoading(true);
      await createAdmin(values);
      message.success("Admin created successfully");
      setModalVisible(false);
      form.resetFields();
      fetchAdmins();
    } catch (error) {
      message.error("Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
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

  const AdminForm = ({ onFinish, loading }) => (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        name="fullname"
        label="Full Name"
        rules={[{ required: true, message: "Please input full name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Please input email!" },
          { type: "email", message: "Please enter a valid email!" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: "Please input password!" },
          { min: 8, message: "Password must be at least 8 characters!" },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Create Admin
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2>Admins Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Add New Admin
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={admins}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={loading}
      />

      <Modal
        title="Add New Admin"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <AdminForm onFinish={handleAddAdmin} loading={loading} />
      </Modal>
    </div>
  );
};

export default AdminsPage;