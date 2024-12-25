import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Select, 
  Button, 
  Typography, 
  Space, 
  Badge, 
  Spin, 
  TimePicker,
  Input,
  Divider,
  Form
} from 'antd';
import { format, parse, setHours, setMinutes } from 'date-fns';
import { differenceInMinutes } from 'date-fns';
import { 
  CalendarOutlined, 
  UserOutlined, 
  ClockCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import debounce from 'lodash/debounce';
import axios from '../../../../../utils/axios';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AppointmentModal = ({
  open,
  onCancel,
  onSubmit,
  selectedSlot,
  selectedClient,
  setSelectedClient,
  therapist,
  loading
}) => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [clientOptions, setClientOptions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [appointmentTime, setAppointmentTime] = useState({
    start: selectedSlot?.start ? dayjs(selectedSlot.start) : null,
    end: selectedSlot?.end ? dayjs(selectedSlot.end) : null
  });

  useEffect(() => {
    if (selectedSlot) {
      setAppointmentTime({
        start: dayjs(selectedSlot.start),
        end: dayjs(selectedSlot.end)
      });
      form.setFieldsValue({
        startTime: dayjs(selectedSlot.start),
        endTime: dayjs(selectedSlot.end)
      });
    }
  }, [selectedSlot]);

  useEffect(() => {
    fetchClients();
  }, []);

  const debouncedSearch = debounce((value) => {
    fetchClients(value);
  }, 500);

  const handleSearch = (value) => {
    setSearchText(value);
    debouncedSearch(value);
  };

  const fetchClients = async (search = '') => {
    try {
      setSearchLoading(true);
      const response = await axios.get('/admin/get-client', {
        params: {
          fullname: search,
          page: 1,
          limit: 5
        }
      });
      setClientOptions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const getDurationText = () => {
    if (!appointmentTime.start || !appointmentTime.end) return '';
    const minutes = differenceInMinutes(
      appointmentTime.end.toDate(),
      appointmentTime.start.toDate()
    );
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${minutes} minutes`;
    } else if (remainingMinutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minutes`;
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!selectedClient) return;

      const appointmentData = {
        start: values.startTime.toDate(),
        end: values.endTime.toDate(),
        notes: values.notes,
        clientId: selectedClient.id,
        therapistId: therapist.id
      };

      onSubmit(appointmentData);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

 
  const handleCancel = () => {
    form.resetFields();
    setSelectedClient(null);
    onCancel();
  };
  return (
    <Modal
      title={
        <div className="modal-header flex items-center gap-2">
          <CalendarOutlined className="text-blue-500" />
          <span>Schedule New Appointment</span>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          disabled={!selectedClient || !selectedSlot || loading}
          loading={loading}
        >
          Create Appointment
        </Button>,
      ]}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          startTime: appointmentTime.start,
          endTime: appointmentTime.end
        }}
      >
        {/* Date and Time Section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-4">
            <Title level={5} className="m-0">
              {selectedSlot && format(selectedSlot.start, "EEEE, MMMM d, yyyy")}
            </Title>
            <Badge status="processing" text={getDurationText()} />
          </div>

          <Form.Item
            label="Appointment Time"
            required
            className="mb-0"
          >
            <Space>
              <Form.Item
                name="startTime"
                noStyle
                rules={[{ required: true, message: 'Start time is required' }]}
              >
                <TimePicker
                  format="h:mm a"
                  minuteStep={15}
                  onChange={(time) => {
                    setAppointmentTime(prev => ({ ...prev, start: time }));
                    // Also update end time to be 1 hour later by default if not set
                    if (!appointmentTime.end) {
                      const endTime = time?.clone().add(1, 'hour');
                      form.setFieldsValue({ endTime });
                      setAppointmentTime(prev => ({ ...prev, end: endTime }));
                    }
                  }}
                />
              </Form.Item>
              <span>to</span>
              <Form.Item
                name="endTime"
                noStyle
                rules={[{ required: true, message: 'End time is required' }]}
              >
                <TimePicker
                  format="h:mm a"
                  minuteStep={15}
                  onChange={(time) => setAppointmentTime(prev => ({ ...prev, end: time }))}
                />
              </Form.Item>
            </Space>
          </Form.Item>
        </div>

        {/* Client Selection Section */}
        <div className="mb-4">
          <Title level={5} className="flex items-center gap-2 mb-3">
            <UserOutlined />
            <span>Select Client</span>
          </Title>
          <Select
            showSearch
            className="w-full"
            placeholder="Search for a client"
            value={selectedClient?.id}
            onChange={(value) => {
              const client = clientOptions.find(c => c.id === value);
              setSelectedClient(client);
            }}
            style={{width:"100%" , marginBottom:"30px"}}
            onSearch={handleSearch}
            loading={searchLoading}
            filterOption={false}
            notFoundContent={searchLoading ? <Spin size="small" /> : null}
          >
            {clientOptions.map((client) => (
              <Option key={client.id} value={client.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserOutlined />
                    <span>{client.user.fullname}</span>
                  </div>
                  {/* <Text type="secondary" className="text-sm">
                    {client.user.email}
                  </Text> */}
                </div>
              </Option>
            ))}
          </Select>
        </div>

        {/* Notes Section */}
        <Form.Item
          name="notes"
          label={
            <div className="flex items-center gap-2">
              <FileTextOutlined />
              <span>Appointment Notes</span>
            </div>
          }
          rules={[{ required: true, message: 'Please add appointment notes' }]}
        >
          <TextArea
            rows={4}
            placeholder="Enter details about the appointment..."
            className="mt-2"
          />
        </Form.Item>

        <Divider />

        {/* Therapist Info Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-4 mb-3">
            <img 
              src={therapist?.profilePicture || 'https://via.placeholder.com/40'} 
              alt={therapist?.user.fullname}
              className="w-10 h-10 rounded-full therapist-img-m"
            />
            <div>
              <Text strong className="block">{therapist.user.fullname}</Text>
              <Text type="secondary">{therapist.specializations.type}</Text>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Text strong className="block">Focus:</Text>
              <Text>{therapist.specializations.focus}</Text>
            </div>
            <div>
              <Text strong className="block">Working Hours:</Text>
              <Text>
                {therapist.availableHours[format(selectedSlot?.start || new Date(), 'EEEE').toLowerCase()] || 'N/A'}
              </Text>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AppointmentModal;