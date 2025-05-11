import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdmins,
  addAdmin,
  removeAdmin,
} from "../../../../store/admin/adminSlice";
import useResponsive from "../../../../hooks/useResponsive";
const AdminsPage = () => {
  const dispatch = useDispatch();
  const { admins, total, currentPage, pageSize, loading } = useSelector(
    (state) => state.admin
  );

  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const isMobile = useResponsive();

  useEffect(() => {
    dispatch(fetchAdmins({ fullname: search, page: currentPage, pageSize }));
  }, [dispatch, search, currentPage, pageSize]);

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    dispatch(fetchAdmins({ fullname: search, page: current, pageSize }));
  };

  const handleAddAdmin = async (values) => {
    try {
      await dispatch(addAdmin(values)).unwrap();
      message.success("Admin created successfully");
      setModalVisible(false);
      form.resetFields();
      dispatch(fetchAdmins({ fullname: search, page: currentPage, pageSize }));
    } catch (error) {
      message.error(error || "Failed to create admin");
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
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} />
          <Popconfirm
            title="Are you sure you want to delete this client?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleDelete = async (id) => {
    try {
      await dispatch(removeAdmin(id)).unwrap();
      message.success("Admin deleted successfully");
    } catch (err) {
      message.error("Failed to delete Admin");
    }
  };

  return (
    <div>
      <div className="mb-6 custom-title-c  admin-bx flex justify-between items-center">
        <Space style={{display:'flex' , justifyContent:"space-between" , width:"100%" , margin:"10px  0px"}}>
          <Input
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            suffix={<SearchOutlined />}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Admin
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={admins}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
        }}
        loading={loading}
        onChange={handleTableChange}
        scroll={isMobile ? { x: "max-content" } : undefined}
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
        <Form form={form} onFinish={handleAddAdmin} layout="vertical">
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
      </Modal>
    </div>
  );
};

export default AdminsPage;
