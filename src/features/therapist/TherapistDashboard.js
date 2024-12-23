import React, { useState } from 'react';
import { Card, Table, Select, Tag, message } from 'antd';
import { useSelector } from 'react-redux';
import { updateAppointment } from '../../api/appointment';

const { Option } = Select;

const TherapistDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState(user?.therapist?.appointments || []);

  const getStatusColor = (status) => {
    const colors = {
      SCHEDULED: 'blue',
      COMPLETED: 'green',
      CANCELLED: 'red',
      RESCHEDULED: 'orange',
    };
    return colors[status] || 'default';
  };

  const handleStatusChange = async (value, record) => {
    try {
      setLoading(true);
      await updateAppointment(record.id, { status: value });
      
      // Update local state
      setAppointments(prev => prev.map(apt => 
        apt.id === record.id ? { ...apt, status: value } : apt
      ));
      
      message.success('Appointment status updated successfully');
    } catch (error) {
      message.error('Failed to update appointment status');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Client Name',
      dataIndex: 'clientName',
      key: 'clientName',
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
          minute: '2-digit' 
        });
        const end = new Date(record.endTime).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        return `${start} - ${end}`;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 130 }}
          onChange={(value) => handleStatusChange(value, record)}
          disabled={loading}
        >
          <Option value="SCHEDULED">
            <Tag color={getStatusColor('SCHEDULED')}>SCHEDULED</Tag>
          </Option>
          <Option value="COMPLETED">
            <Tag color={getStatusColor('COMPLETED')}>COMPLETED</Tag>
          </Option>
          <Option value="CANCELLED">
            <Tag color={getStatusColor('CANCELLED')}>CANCELLED</Tag>
          </Option>
          <Option value="RESCHEDULED">
            <Tag color={getStatusColor('RESCHEDULED')}>RESCHEDULED</Tag>
          </Option>
        </Select>
      ),
      filters: [
        { text: 'Scheduled', value: 'SCHEDULED' },
        { text: 'Completed', value: 'COMPLETED' },
        { text: 'Cancelled', value: 'CANCELLED' },
        { text: 'Rescheduled', value: 'RESCHEDULED' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
      width: 200,
    },
  ];

  const filteredAppointments = appointments.filter(apt => 
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
            <Option value="CANCELLED">Cancelled</Option>
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
    </div>
  );
};

export default TherapistDashboard;