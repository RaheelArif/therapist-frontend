import React, { useState, useEffect } from 'react';
import { Card, Table, Select, Tag, Button, message } from 'antd';
import { useSelector } from 'react-redux';
import { getAppointments } from '../../api/appointment';
import ChangeStatusModal from './components/ChangeStatusModal';

const { Option } = Select;

const TherapistDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (user?.user?.therapist?.id) {
        try {
          setLoading(true);
          const response = await getAppointments({ therapistId: user.user.therapist.id });
          setAppointments(response);
        } catch (error) {
          message.error('Failed to fetch appointments');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAppointments();
  }, [user?.user?.therapist?.id]);

  const getStatusColor = (status) => {
    const colors = {
      SCHEDULED: 'blue',
      COMPLETED: 'green',
      CANCELED: 'red',
      RESCHEDULED: 'orange',
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'Client Name',
      dataIndex: ['client', 'user', 'fullname'],
      key: 'clientName',
      render: (text, record) => record.client?.user?.fullname || 'N/A',
    },
    {
      title: 'Date',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.startTime) - new Date(b.startTime),
    },
    {
      title: 'Time',
      dataIndex: 'startTime',
      key: 'time',
      render: (text, record) => {
        const start = new Date(record.startTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        const end = new Date(record.endTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        return `${start} - ${end}`;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <>
          <Tag color={getStatusColor(status)}>{status}</Tag>
          <Button
            type="link"
            onClick={() => setSelectedAppointment(record)}
          >
            Change Status
          </Button>
        </>
      ),
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
      width: 200,
    },
  ];

  const filteredAppointments = appointments.filter((apt) =>
    statusFilter === 'ALL' ? true : apt.status === statusFilter
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
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {selectedAppointment && (
        <ChangeStatusModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onSuccess={(updatedAppointment) => {
            setAppointments((prev) =>
              prev.map((apt) =>
                apt.id === updatedAppointment.id ? updatedAppointment : apt
              )
            );
            setSelectedAppointment(null);
          }}
        />
      )}
    </div>
  );
};

export default TherapistDashboard;
