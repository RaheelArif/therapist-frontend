import React, { useEffect, useState } from "react";
import { Table, Button, Space, Modal, message, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import ClientForm from "./components/ClientForm";
import {
  fetchClients,
  addNewClient,
  editClient,
  removeClient,
  selectClients,
  selectClientStatus,
  selectClientPagination,
  selectClientError,
} from "../../../../store/client/clientSlice";

const ClientsPage = () => {
  const dispatch = useDispatch();
  const clients = useSelector(selectClients);
  const status = useSelector(selectClientStatus);
  const pagination = useSelector(selectClientPagination);
  const error = useSelector(selectClientError);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchClients({ page: 1, pageSize: 10 }));
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleTableChange = (newPagination) => {
    dispatch(
      fetchClients({
        page: newPagination.current,
        pageSize: newPagination.pageSize,
      })
    );
  };

  const handleAddClient = async (values) => {
    try {
      await dispatch(addNewClient(values)).unwrap();
      message.success("Client created successfully");
      setModalVisible(false);
    } catch (err) {
      message.error("Failed to create client");
    }
  };

  const handleEdit = (record) => {
    setEditingClient(record);
    setModalVisible(true);
  };

  const handleEditSubmit = async (values) => {
    try {
      await dispatch(
        editClient({ id: editingClient.id, data: values })
      ).unwrap();
      message.success("Client updated successfully");
      setModalVisible(false);
      setEditingClient(null);
    } catch (err) {
      message.error("Failed to update client");
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(removeClient(id)).unwrap();
      message.success("Client deleted successfully");
    } catch (err) {
      message.error("Failed to delete client");
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingClient(null);
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
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
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

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2
          onClick={() => console.log(clients)}
          className="text-2xl font-semibold"
        >
          Clients Management
        </h2>
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
        pagination={{
          ...pagination,
          showSizeChanger: false,

          defaultPageSize: 10,
        }}
        loading={status === "loading"}
        onChange={handleTableChange}
      />

      <Modal
        title={editingClient ? "Edit Client" : "Add New Client"}
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={800}
      >
        <ClientForm
          onFinish={editingClient ? handleEditSubmit : handleAddClient}
          initialValues={editingClient} // Pass editing client to the form 
          loading={status === "loading"}
        />
      </Modal>
    </div>
  );
};

export default ClientsPage;