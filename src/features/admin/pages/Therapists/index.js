import React, { useEffect, useState } from "react";
import { Table, Button, Space, Modal, message, Popconfirm, Tag } from "antd"; // Import Tag
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import TherapistForm from "./components/TherapistForm";
import {
  fetchTherapists,
  addNewTherapist,
  removeTherapist,
  selectTherapists,
  selectTherapistStatus,
  selectTherapistPagination,
  selectTherapistError,
} from "../../../../store/therapist/therapistSlice";
import { resetAppointmentState } from "../../../../store/appointment/appointmentSlice";

import { useNavigate } from "react-router-dom";

const TherapistsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const therapists = useSelector(selectTherapists);
  const status = useSelector(selectTherapistStatus);
  const pagination = useSelector(selectTherapistPagination);
  const error = useSelector(selectTherapistError);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTherapists({ page: 1, pageSize: 10 }));
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleSetAppointment = async (therapist) => {
    try {
      await dispatch(resetAppointmentState(therapist)).unwrap();
      navigate("/admin/add-appointment");
    } catch (err) {
      message.error("Failed to initialize appointment page");
    }
  };

  const handleTableChange = (newPagination) => {
    dispatch(
      fetchTherapists({
        page: newPagination.current,
        pageSize: newPagination.pageSize,
      })
    );
  };

  const handleAddTherapist = async (values) => {
    try {
      await dispatch(addNewTherapist(values)).unwrap();
      message.success("Therapist created successfully");
      setModalVisible(false);
    } catch (err) {
      message.error("Failed to create therapist");
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(removeTherapist(id)).unwrap();
      message.success("Therapist deleted successfully");
    } catch (err) {
      message.error("Failed to delete therapist");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: ["user", "fullname"],
      key: "fullName",
    },
    {
      title: "Bio",
      dataIndex: "bio",
      key: "bio",
    },
    {
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
      render: (exp) => `${exp} years`,
    },
    {
      title: "Status",
      dataIndex: "isOnline",
      key: "isOnline",
      render: (isOnline) => (
        <Tag color={isOnline ? "green" : "red"}>
          {isOnline ? "Online" : "Offline"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Are you sure you want to delete this therapist?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>

          <Button
            type="primary"
            icon={<CalendarOutlined />}
            onClick={() => handleSetAppointment(record)}
            disabled={record.isOnline ? false : true}
          >
            Set Appointment
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Therapists Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Add New Therapist
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={therapists}
        rowKey="id"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          defaultPageSize: 10,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        loading={status === "loading"}
        onChange={handleTableChange}
      />

      <Modal
        title="Add New Therapist"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <TherapistForm
          onFinish={handleAddTherapist}
          loading={status === "loading"}
        />
      </Modal>
    </div>
  );
};

export default TherapistsPage;
