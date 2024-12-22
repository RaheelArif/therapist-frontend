import React, { useState, useEffect } from 'react';
import { Modal, Select, Button, Typography, Alert, Space, Badge, Spin } from 'antd';
import { format } from 'date-fns';
import { differenceInMinutes } from 'date-fns';
import { CalendarOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import debounce from 'lodash/debounce';
import axios from '../../../../../utils/axios';

const { Text, Title } = Typography;
const { Option } = Select;


const AppointmentModal = ({
  open,
  onCancel,
  onSubmit,
  selectedSlot,
  selectedClient,
  setSelectedClient,
  therapist,
  clients,
  loading
}) => {
  const [searchText, setSearchText] = useState('');
  const [clientOptions, setClientOptions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  useEffect(() => {
    fetchClients();
  }, []);

  // Debounced search function
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
  // Calculate duration from selected slot
  const getDurationText = () => {
    if (!selectedSlot) return '';
    const minutes = differenceInMinutes(selectedSlot.end, selectedSlot.start);
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

  const handleSubmit = () => {
    if (!selectedClient || !selectedSlot) return;

    const appointmentData = {
      start: selectedSlot.start,
      end: selectedSlot.end
    };

    onSubmit(appointmentData);
  };

  // Get day name
  const getDayName = () => {
    if (!selectedSlot) return '';
    return format(selectedSlot.start, 'EEEE');
  };

  return (
    <Modal
    title={
      <div className="modal-header">
        <CalendarOutlined className="modal-header-icon" />
        <span>Schedule New Appointment</span>
      </div>
    }
    open={open}
    onCancel={onCancel}
    footer={[
      <Button key="back" onClick={onCancel} className="cancel-btn">
        Cancel
      </Button>,
      <Button
        key="submit"
        type="primary"
        onClick={handleSubmit}
        disabled={!selectedClient || !selectedSlot || loading}
        loading={loading}
        className="submit-btn"
      >
        Create Appointment
      </Button>,
    ]}
    className="appointment-modal"
    width={600}
  >
    <div className="appointment-modal-content">
      {/* Time Slot Section */}
      {selectedSlot && (
        <div className="time-slot-section">
          <div className="date-display">
            <Title level={4}>{format(selectedSlot.start, "EEEE, MMMM d, yyyy")}</Title>
            <Badge 
              status="processing" 
              text={getDurationText()} 
              className="duration-badge"
            />
          </div>

          <div className="time-display">
            <ClockCircleOutlined />
            <Text>
              {format(selectedSlot.start, "h:mm a")} - {format(selectedSlot.end, "h:mm a")}
            </Text>
          </div>
        </div>
      )}

      {/* Client Selection Section */}
      <div className="client-section">
          <Title level={5}>
            <UserOutlined /> Select Client
          </Title>
          <Select
            showSearch
            className="client-select"
            placeholder="Search for a client"
            value={selectedClient?.id}
            onChange={(value) => {
              const client = clientOptions.find(c => c.id === value);
              setSelectedClient(client);
            }}
            onSearch={handleSearch}
            loading={searchLoading}
            filterOption={false}
            notFoundContent={searchLoading ? <Spin size="small" /> : null}
            style={{ width: '100%' }}
          >
            {clientOptions.map((client) => (
              <Option key={client.id} value={client.id}>
                <div className="client-option">
                  <UserOutlined className="client-icon" />
                  <span>{client.user.fullname}</span>
                  <span className="client-email">{client.user.email}</span>
                </div>
              </Option>
            ))}
          </Select>
        </div>
      
      {/* Therapist Info Section */}
      <div className="therapist-section">
        <div className="therapist-header">
          <img 
            src={therapist?.profilePicture || 'https://via.placeholder.com/40'} 
            alt={therapist?.user.fullname}
            className="therapist-avatar"
          />
          <div className="therapist-info">
            <Text strong>{therapist.user.fullname}</Text>
            <Text type="secondary">{therapist.specializations.type}</Text>
          </div>
        </div>
        <div className="therapist-details">
          <div className="detail-item">
            <Text strong>Focus:</Text>
            <Text>{therapist.specializations.focus}</Text>
          </div>
          <div className="detail-item">
            <Text strong>Working Hours:</Text>
            <Text>{therapist.availableHours[format(selectedSlot?.start || new Date(), 'EEEE').toLowerCase()] || 'N/A'}</Text>
          </div>
        </div>
      </div>
    </div>
  </Modal>
  );
};

export default AppointmentModal;