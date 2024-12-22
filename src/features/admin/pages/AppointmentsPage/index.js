// pages/Appointments/index.jsx
import React, { useEffect, useState } from 'react';
import { Table, Card, Tag, Space, Input, Select, Button, Popconfirm, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { 
  fetchAppointments, 
  deleteAppointment,
  selectAppointments, 
  selectAppointmentStatus,
  selectAppointmentPagination,
  selectAppointmentError
} from '../../../../store/appointment/appointmentSlice';
import { format } from 'date-fns';

const { Option } = Select;

const AppointmentsPage = () => {
  const dispatch = useDispatch();
  const appointments = useSelector(selectAppointments);
  const status = useSelector(selectAppointmentStatus);
  const pagination = useSelector(selectAppointmentPagination);
  const error = useSelector(selectAppointmentError);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const fetchAppointmentData = () => {
    dispatch(fetchAppointments({
      page: pagination.current,
      pageSize: pagination.pageSize,
      search: searchText,
      status: statusFilter
    }));
  };

  useEffect(() => {
    fetchAppointmentData();
  }, []);

  const handleTableChange = (newPagination) => {
    dispatch(fetchAppointments({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
      search: searchText,
      status: statusFilter
    }));
  };

  const handleSearch = () => {
    dispatch(fetchAppointments({
      page: 1,
      pageSize: pagination.pageSize,
      search: searchText,
      status: statusFilter
    }));
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteAppointment(id)).unwrap();
      message.success('Appointment deleted successfully');
      fetchAppointmentData();
    } catch (err) {
      message.error('Failed to delete appointment');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      SCHEDULED: 'processing',
      COMPLETED: 'success',
      CANCELLED: 'error',
      RESCHEDULED: 'warning'
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'Client',
      dataIndex: ['client', 'user', 'fullname'],
      key: 'clientName',
      sorter: true,
    },
    {
      title: 'Therapist',
      dataIndex: ['therapist', 'user', 'fullname'],
      key: 'therapistName',
      sorter: true,
    },
    {
      title: 'Date',
      dataIndex: 'startTime',
      key: 'date',
      render: (text) => format(new Date(text), 'MMM dd, yyyy'),
      sorter: true,
    },
    {
      title: 'Time',
      dataIndex: 'startTime',
      key: 'time',
      render: (text, record) => (
        `${format(new Date(text), 'h:mm a')} - ${format(new Date(record.endTime), 'h:mm a')}`
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Are you sure you want to delete this appointment?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    }
  ];

  return (
    <div className="p-6">
      <Card title="Appointments List">
        <div className="mb-6 flex gap-4">
          <Input
            placeholder="Search by client or therapist name"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 300 }}
            allowClear
          />
          <Select
            placeholder="Filter by status"
            style={{ width: 200 }}
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              dispatch(fetchAppointments({
                page: 1,
                pageSize: pagination.pageSize,
                search: searchText,
                status: value
              }));
            }}
            allowClear
          >
            <Option value="SCHEDULED">Scheduled</Option>
            <Option value="COMPLETED">Completed</Option>
            <Option value="CANCELLED">Cancelled</Option>
            <Option value="RESCHEDULED">Rescheduled</Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          loading={status === 'loading'}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

export default AppointmentsPage;