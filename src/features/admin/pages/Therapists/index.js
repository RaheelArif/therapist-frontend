import React, { useEffect, useState } from "react";
import { Table, Button, Space, Modal, message, Popconfirm, Tag } from "antd";
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
import useResponsive from "../../../../hooks/useResponsive"; // <--- IMPORT THE HOOK (adjust path)

const TherapistsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const therapists = useSelector(selectTherapists);
  const status = useSelector(selectTherapistStatus);
  const pagination = useSelector(selectTherapistPagination);
  const error = useSelector(selectTherapistError);
  const [modalVisible, setModalVisible] = useState(false);

  const isMobile = useResponsive(); // <--- USE THE HOOK (default breakpoint 768px)
  // const isMobile = useResponsive(992); // Example: for screens smaller than lg

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
      // Optional: if you want a fixed width for some columns
      // width: 150,
      // Optional: if you want the name column to be fixed while scrolling
      // fixed: isMobile ? undefined : 'left', // Only fix on non-mobile if desired
    },
    {
      title: "Bio",
      dataIndex: "bio",
      key: "bio",
      // width: 200,
    },
    {
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
      render: (exp) => `${exp} years`,
      // width: 120,
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
      // width: 100,
    },
    {
      title: "Actions",
      key: "actions",
      // width: 200, // Give actions column enough space
      // fixed: isMobile ? undefined : 'right', // Fix actions column on desktop
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
            disabled={!record.isOnline} // Simplified a bit
          >
            Set Appointment
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6  custom-title-c flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Therapists</h2>
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
        scroll={isMobile ? { x: "max-content" } : undefined}
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
