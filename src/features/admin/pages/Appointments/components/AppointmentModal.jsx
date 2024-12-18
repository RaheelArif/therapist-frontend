import React from 'react';
import { Modal, Select, Button, Typography, Alert, Space, Badge } from 'antd';
import { format } from 'date-fns';
import { differenceInMinutes } from 'date-fns';
import { CalendarOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';


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
          className="client-select"
          placeholder="Choose a client for this appointment"
          value={selectedClient?.id}
          onChange={(value) => setSelectedClient(clients.find(c => c.id === value))}
        >
          {clients.map((client) => (
            <Option key={client.id} value={client.id}>
              <div className="client-option">
                <UserOutlined className="client-icon" />
                <span>{client.user.fullname}</span>
              </div>
            </Option>
          ))}
        </Select>
      </div>
      
      {/* Therapist Info Section */}
      <div className="therapist-section">
        <div className="therapist-header">
          <img 
            src={therapist.profilePicture || 'https://via.placeholder.com/40'} 
            alt={therapist.user.fullname}
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