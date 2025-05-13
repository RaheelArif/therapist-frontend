// pages/Appointments/index.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Tag,
  Space,
  Select,
  Button,
  Popconfirm,
  message,
  Spin,
  Typography,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { DeleteOutlined, UserOutlined } from "@ant-design/icons";
import {
  fetchAppointments,
  deleteAppointment,
  selectAppointments,
  updateAppointment,
  selectAppointmentStatus,
  selectAppointmentError,
} from "../../../../store/appointment/appointmentSlice";
import { getClients } from "../../../../api/client";
import { getTherapists } from "../../../../api/therapist";
import { format, differenceInMinutes } from "date-fns"; // Import differenceInMinutes
import debounce from "lodash/debounce";
import useResponsive from "../../../../hooks/useResponsive";

const { Option } = Select;

const AppointmentsPage = () => {
  const dispatch = useDispatch();
  const appointments = useSelector(selectAppointments);
  const status = useSelector(selectAppointmentStatus);
  const error = useSelector(selectAppointmentError);

  const [statusFilter, setStatusFilter] = useState("SCHEDULED");
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [clientOptions, setClientOptions] = useState([]);
  const [therapistOptions, setTherapistOptions] = useState([]);
  const [clientSearchLoading, setClientSearchLoading] = useState(false);
  const [therapistSearchLoading, setTherapistSearchLoading] = useState(false);
  const isMobile = useResponsive();

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  useEffect(() => {
    fetchAppointmentData();
  }, [statusFilter, selectedClient, selectedTherapist]);

  const fetchAppointmentData = () => {
    dispatch(
      fetchAppointments({
        status: statusFilter,
        clientId: selectedClient?.id,
        therapistId: selectedTherapist?.id,
      })
    );
  };

  // Debounced search functions
  const fetchClients = async (search = "") => {
    try {
      setClientSearchLoading(true);
      const response = await getClients({
        fullname: search,
        page: 1,
        pageSize: 5,
      });
      setClientOptions(response.data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setClientSearchLoading(false);
    }
  };

  const fetchTherapists = async (search = "") => {
    try {
      setTherapistSearchLoading(true);
      const response = await getTherapists({
        fullname: search,
        page: 1,
        pageSize: 5,
      });
      // Now correctly accessing the data array from the paginated response
      setTherapistOptions(response.data || []);
    } catch (error) {
      console.error("Error fetching therapists:", error);
    } finally {
      setTherapistSearchLoading(false);
    }
  };

  const debouncedClientSearch = debounce(fetchClients, 500);
  const debouncedTherapistSearch = debounce(fetchTherapists, 500);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteAppointment(id)).unwrap();
      message.success("Appointment deleted successfully");
      fetchAppointmentData();
    } catch (err) {
      message.error("Failed to delete appointment");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      SCHEDULED: "processing",
      COMPLETED: "success",
      CANCELED: "error",
      RESCHEDULED: "warning",
    };
    return colors[status] || "default";
  };

  const columns = [
    {
      title: "Client",
      dataIndex: ["client", "user", "fullname"],
      key: "clientName",
      width: "120px",
    },
    {
      title: "Therapist",
      dataIndex: ["therapist", "user", "fullname"],
      key: "therapistName",
      width: "150px",
    },
    {
      title: "Date",
      dataIndex: "startTime",
      key: "date",
      render: (text) => format(new Date(text), "MMM dd, yyyy"),
      width: "150px",
    },
    {
      title: "Time",
      dataIndex: "startTime",
      key: "time",
      render: (text, record) =>
        `${format(new Date(text), "h:mm a")} - ${format(
          new Date(record.endTime),
          "h:mm a"
        )}`,
      width: "100px",
    },
    {
      title: "Duration",
      dataIndex: "startTime",
      key: "duration",
      render: (startTime, record) => {
        const start = new Date(startTime);
        const end = new Date(record.endTime);
        const duration = differenceInMinutes(end, start);
        return <Tag color="black">{`${duration} minutes`}</Tag>;
      },
      width: "100px",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 130 }}
          onChange={(newStatus) => handleStatusChange(record.id, newStatus)}
          bordered={false}
        >
          <Option value="SCHEDULED">
            <Tag color="processing">SCHEDULED</Tag>
          </Option>
          <Option value="COMPLETED">
            <Tag color="success">COMPLETED</Tag>
          </Option>
          <Option value="CANCELED">
            <Tag color="error">CANCELED</Tag>
          </Option>
          <Option value="RESCHEDULED">
            <Tag color="warning">RESCHEDULED</Tag>
          </Option>
        </Select>
      ),
      width: "150px",
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      width: 150, // Keep the width to constrain the text
      // Remove the basic 'ellipsis: true' as we are using a custom render for advanced ellipsis
      render: (text) => {
        if (!text) { // Handle cases where notes might be null or empty
          return null;
        }
        return (
          <Typography.Text
            style={{ width: '100%' }} // Important: Typography.Text needs a width constraint to know when to clamp
            ellipsis={{
              rows: 3,
              expandable: true, // Allows user to expand to see full text
              // symbol: 'more', // Optional: customize the expand symbol/text
              tooltip: text     // Optional: shows a tooltip with the full text on hover when truncated
            }}
          >
            {text}
          </Typography.Text>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Are you sure you want to delete this appointment?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await dispatch(
        updateAppointment({
          id: appointmentId,
          data: { status: newStatus },
        })
      ).unwrap();
      message.success(`Appointment status updated to ${newStatus}`);
      fetchAppointmentData(); // Refresh the list
    } catch (err) {
      message.error("Failed to update appointment status");
    }
  };
  return (
    <div className="p-6">
      <div className="mb-6 search-bx-ap flex gap-4">
        {/* Client Filter */}
        <Select
          showSearch
          placeholder="Search Client"
          style={{ width: 250 }}
          value={selectedClient?.id}
          onChange={(value) => {
            const client = clientOptions.find((c) => c.id === value);
            setSelectedClient(client);
          }}
          onSearch={debouncedClientSearch}
          loading={clientSearchLoading}
          filterOption={false}
          allowClear
          onClear={() => setSelectedClient(null)}
          notFoundContent={clientSearchLoading ? <Spin size="small" /> : null}
        >
          {clientOptions.map((client) => (
            <Option key={client.id} value={client.id}>
              <div className="flex items-center gap-2">
                <UserOutlined />
                <span>{client.user.fullname}</span>
              </div>
            </Option>
          ))}
        </Select>

        {/* Therapist Filter */}
        <Select
          showSearch
          placeholder="Search Therapist"
          style={{ width: 250 , margin:"0px 10px" }}
          value={selectedTherapist?.id}
          onChange={(value) => {
            const therapist = therapistOptions.find((t) => t.id === value);
            setSelectedTherapist(therapist);
          }}
          onSearch={debouncedTherapistSearch}
          loading={therapistSearchLoading}
          filterOption={false}
          allowClear
          onClear={() => setSelectedTherapist(null)}
          notFoundContent={
            therapistSearchLoading ? <Spin size="small" /> : null
          }
        >
          {therapistOptions?.map((therapist) => (
            <Option key={therapist.id} value={therapist.id}>
              <div className="flex items-center gap-2">
                <UserOutlined />
                <span>{therapist.user.fullname}</span>
              </div>
            </Option>
          ))}
        </Select>

        {/* Status Filter */}
        <Select
          placeholder="Filter by status"
          style={{ width: 200 }}
          value={statusFilter}
          onChange={setStatusFilter}
          allowClear
        >
          <Option value="SCHEDULED">Scheduled</Option>
          <Option value="COMPLETED">Completed</Option>
          <Option value="CANCELED">CANCELED</Option>
          <Option value="RESCHEDULED">Rescheduled</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={appointments}
        rowKey="id"
        loading={status === "loading"}
        scroll={isMobile ? { x: "max-content" } : undefined}
      />
    </div>
  );
};

export default AppointmentsPage;
