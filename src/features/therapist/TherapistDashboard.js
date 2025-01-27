import React, { useState, useEffect } from "react";
import { Card, Table, Select, Tag, Button, message, Space } from "antd";
import { useSelector } from "react-redux";
import { getAppointments } from "../../api/appointment";
import ChangeStatusModal from "./components/ChangeStatusModal";
import AddDocumentsModal from "./components/AddDocumentsModal";
import ViewNotesModal from "./components/ViewNotesModal";
import FileViewerModal from "./components/FileViewerModal";

const { Option } = Select;

const TherapistDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedStatusAppointment, setSelectedStatusAppointment] =
    useState(null);
  const [selectedDocumentAppointment, setSelectedDocumentAppointment] =
    useState(null);
  const [selectedNoteAppointment, setSelectedNoteAppointment] = useState(null);
  const [selectedFileAppointment, setSelectedFileAppointment] = useState(null);
  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (user?.user?.therapist?.id) {
        try {
          setLoading(true);
          const response = await getAppointments({
            therapistId: user.user.therapist.id,
          });
          setAppointments(response);
        } catch (error) {
          message.error("Failed to fetch appointments");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAppointments();
  }, [user?.user?.therapist?.id]);

  const getStatusColor = (status) => {
    const colors = {
      SCHEDULED: "blue",
      COMPLETED: "green",
      CANCELED: "red",
      RESCHEDULED: "orange",
    };
    return colors[status] || "default";
  };

  const handleViewNotes = (record) => {
    setSelectedNoteAppointment(record);
  };

  const handleViewFile = (record) => {
    setSelectedFileAppointment(record);
  };
  const columns = [
    {
      title: "Client Name",
      dataIndex: ["client", "user", "fullname"],
      key: "clientName",
      render: (text, record) => record.client?.user?.fullname || "N/A",
    },
    {
      title: "Date",
      dataIndex: "startTime",
      key: "startTime",
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.startTime) - new Date(b.startTime),
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
      render: (status, record) => (
        <>
          <Tag color={getStatusColor(status)}>{status}</Tag>
          <Button
            type="primary"
            onClick={() => setSelectedStatusAppointment(record)}
          >
            Change Status
          </Button>
        </>
      ),
    },
    {
      title: "Notes",
      key: "notes",
      render: (_, record) => {
        if (record.clientNotes && record.clientNotes.length > 0) {
          return (
            <Button onClick={() => handleViewNotes(record)}>View Notes</Button>
          );
        }
        return null;
      },
    },
    {
      title: "Documents",
      key: "documents",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => setSelectedDocumentAppointment(record)}
        >
          Add/View Documents
        </Button>
      ),
    },
    {
      title: "Client Files",
      key: "clientFiles",
      render: (_, record) => {
        if (record.client?.fileUpload && record.client.fileUpload.length > 0) {
          return (
            <Button onClick={() => handleViewFile(record)}>Client Files</Button>
          );
        }
        return "No Client Files";
      },
    },
  ];

  const filteredAppointments = appointments.filter((apt) =>
    statusFilter === "ALL" ? true : apt.status === statusFilter
  );

  return (
    <div className="p-6">
      <Card
        title="My Appointments"
        extra={
          <Select
            defaultValue="ALL"
            style={{ width: 120 }}
            onChange={setStatusFilter}
          >
            <Option value="ALL">All Status</Option>
            <Option value="SCHEDULED">Scheduled</Option>
            <Option value="COMPLETED">Completed</Option>
            <Option value="CANCELED">CANCELED</Option>
            <Option value="RESCHEDULED">Rescheduled</Option>
          </Select>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredAppointments}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} appointments`,
          }}
          scroll={{ x: "max-content" }}
        />
      </Card>

      {/* Change Status Modal */}
      {selectedStatusAppointment && (
        <ChangeStatusModal
          appointment={selectedStatusAppointment}
          onClose={() => setSelectedStatusAppointment(null)}
          onSuccess={(updatedAppointment) => {
            setAppointments((prev) =>
              prev.map((apt) =>
                apt.id === updatedAppointment.id ? updatedAppointment : apt
              )
            );
            setSelectedStatusAppointment(null);
          }}
        />
      )}

      {/* Add Documents Modal */}
      {selectedDocumentAppointment && (
        <AddDocumentsModal
          appointment={selectedDocumentAppointment}
          onClose={() => setSelectedDocumentAppointment(null)}
          onSuccess={(updatedAppointment) => {
            setAppointments((prev) =>
              prev.map((apt) =>
                apt.id === updatedAppointment.id ? updatedAppointment : apt
              )
            );
            setSelectedDocumentAppointment(null);
          }}
        />
      )}

      {/* View Notes Modal */}
      {selectedNoteAppointment && (
        <ViewNotesModal
          appointment={selectedNoteAppointment}
          onClose={() => setSelectedNoteAppointment(null)}
        />
      )}

      {/* File Viewer Modal */}
      {selectedFileAppointment && (
        <FileViewerModal
          appointment={selectedFileAppointment}
          onClose={() => setSelectedFileAppointment(null)}
        />
      )}
    </div>
  );
};

export default TherapistDashboard;
