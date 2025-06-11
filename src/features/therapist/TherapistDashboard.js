import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Select,
  Tag,
  Button,
  message,
  Space,
  Tabs,
  Input,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { getAppointments } from "../../api/appointment";
import { updateTherapist } from "../../api/therapist"; // Import updateTherapist API
import ChangeStatusModal from "./components/ChangeStatusModal";
import AddDocumentsModal from "./components/AddDocumentsModal";
import ViewNotesModal from "./components/ViewNotesModal";
import FileViewerModal from "./components/FileViewerModal";
import ClientDetails from "./components/ClientDetails";
import TherapistOfflineDateManager from "./components/TherapistOfflineDateManager";
import EditTherapistForm from "./components/EditTherapistForm";
import { updateTherapistProfile } from "../auth/authSlice";

const { Option } = Select;

const TherapistDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [clientNameFilter, setClientNameFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchA, setfetchA] = useState(0);
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
  }, [user?.user?.therapist?.id , fetchA]);

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

  const handleUpdateProfile = async (values) => {
    const therapistId = user?.user?.therapist?.id;
    console.log("therapistId:", therapistId);
    console.log("values before filtering:", values);

    if (!therapistId || typeof therapistId !== "string") {
      message.error("Therapist ID is missing or invalid");
      return;
    }

    // Filter values to include only allowed fields
    const allowedFields = [
      "fullName",
      "experience",
      "bio",
      "dateOfBirth",
      "contactNumber",
      "languagesSpoken",
      "specializations",
      "certifications",
      "workAddress",
      "availableHours",
      "profilePicture",
    ];
    const filteredValues = Object.keys(values)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = values[key];
        return obj;
      }, {});

    console.log("filteredValues:", filteredValues);

    try {
      // Call the updateTherapist API
      const response = await updateTherapist(therapistId, filteredValues);
      console.log("updateTherapist response:", response);

      // Transform response to match updateTherapistProfile payload
      const updatedData = {
        therapistId,
        fullName: response.fullname,
        experience: response.therapist.experience,
        bio: response.therapist.bio,
        dateOfBirth: response.therapist.dateOfBirth,
        contactNumber: response.therapist.contactNumber,
        languagesSpoken: response.therapist.languagesSpoken,
        specializations: response.therapist.specializations,
        certifications: response.therapist.certifications,
        workAddress: response.therapist.workAddress,
        availableHours: response.therapist.availableHours,
        profilePicture: response.therapist.profilePicture,
        isOnline: response.therapist.isOnline,
        offlineDates: response.therapist.offlineDates,
        therapistType: response.therapist.therapistType,
      };

      // Dispatch updateTherapistProfile to update therapist data
      await dispatch(updateTherapistProfile(updatedData)).unwrap();

      // Manually update localStorage to sync entire user object
      const updatedUser = {
        ...user,
        fullname: response.fullname,
        user: {
          ...user.user,
          fullname: response.fullname,
          therapist: {
            ...user.user.therapist,
            ...response.therapist,
            fullName: response.fullname,
          },
        },
        therapist: {
          ...user.therapist,
          ...response.therapist,
          fullName: response.fullname,
        },
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      console.log("Updated localStorage user:", updatedUser);

      // Update Redux state without triggering logout
      dispatch({
        type: "auth/updateUser",
        payload: {
          ...user,
          user: {
            ...user.user,
            fullname: response.fullname,
            therapist: {
              ...user.user.therapist,
              ...response.therapist,
              fullName: response.fullname,
            },
          },
        },
      });

      setfetchA(fetchA + 1);
      message.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      message.error(
        "Failed to update profile: " + (error.message || "Unknown error")
      );
    }
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
      title: "Client Details",
      key: "clientDetails",
      render: (_, record) => (
        <ClientDetails
          user={user}
          appointments={appointments}
          setAppointments={setAppointments}
          record={record}
        />
      ),
    },
  ];

  const filteredAppointments = appointments.filter((apt) => {
    const statusMatch =
      statusFilter === "ALL" ? true : apt.status === statusFilter;
    const clientNameMatch = apt.client?.user?.fullname
      ?.toLowerCase()
      .includes(clientNameFilter.toLowerCase());

    return statusMatch && clientNameMatch;
  });

  const tabItems = [
    {
      key: "appointments",
      label: "Appointments",
      children: (
        <Card
          title="My Appointments"
          extra={
            <Space>
              <Select
                defaultValue="ALL"
                style={{ width: 120 }}
                onChange={setStatusFilter}
              >
                <Option value="ALL">All Status</Option>
                <Option value="SCHEDULED">Scheduled</Option>
                <Option value="COMPLETED">Completed</Option>
                <Option value="CANCELED">Canceled</Option>
                <Option value="RESCHEDULED">Rescheduled</Option>
              </Select>
              <Input
                placeholder="Filter by Client Name"
                style={{ width: 200 }}
                onChange={(e) => setClientNameFilter(e.target.value)}
              />
            </Space>
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
      ),
    },
    {
      key: "offlineDates",
      label: "Manage Offline Dates",
      children: <TherapistOfflineDateManager />,
    },
    {
      key: "updateProfile",
      label: "Update Profile",
      children: (
        <Card title="Update Profile">
          <EditTherapistForm
            onFinish={handleUpdateProfile}
            loading={loading}
            initialValues={{
              fullName: user?.user?.fullname,
              experience: user?.user?.therapist?.experience,
              bio: user?.user?.therapist?.bio,
              dateOfBirth: user?.user?.therapist?.dateOfBirth,
              contactNumber: user?.user?.therapist?.contactNumber,
              languagesSpoken: user?.user?.therapist?.languagesSpoken,
              specializations: user?.user?.therapist?.specializations,
              certifications: user?.user?.therapist?.certifications,
              workAddress: user?.user?.therapist?.workAddress,
              availableHours: user?.user?.therapist?.availableHours,
              profilePicture: user?.user?.therapist?.profilePicture,
            }}
          />
        </Card>
      ),
    },
  ];

  return (
    <div className="">
      <Tabs items={tabItems} />

      {/* Modals (outside Tabs to avoid unmounting) */}
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

      {selectedNoteAppointment && (
        <ViewNotesModal
          appointment={selectedNoteAppointment}
          onClose={() => setSelectedNoteAppointment(null)}
        />
      )}

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
