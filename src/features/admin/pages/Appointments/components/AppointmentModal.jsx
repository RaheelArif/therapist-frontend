import React from 'react';
import { Modal, Select, Button, Typography, Alert, Space } from 'antd';
import { format } from 'date-fns';
import { differenceInMinutes } from 'date-fns';

const { Text } = Typography;
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
      title="Create New Appointment"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
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
    >
      <div className="space-y-4 py-4">
        {/* Selected Time Information */}
        {selectedSlot && (
          <Space direction="vertical" className="w-full">
            <Alert
              message="Selected Time Slot"
              description={
                <div className="space-y-2">
                  <div><Text strong>Date:</Text> {format(selectedSlot.start, "PPPP")}</div>
                  <div>
                    <Text strong>Time:</Text> {format(selectedSlot.start, "h:mm a")} - {format(selectedSlot.end, "h:mm a")}
                  </div>
                  <div><Text strong>Duration:</Text> {getDurationText()}</div>
                </div>
              }
              type="info"
              showIcon
            />
          </Space>
        )}

        {/* Client selection */}
        <div className="mb-4">
          <Text strong className="block mb-2">Select Client</Text>
          <Select
            style={{ width: '100%' }}
            placeholder="Select Client"
            value={selectedClient?.id}
            onChange={(value) => setSelectedClient(clients.find(c => c.id === value))}
          >
            {clients.map((client) => (
              <Option key={client.id} value={client.id}>
                {client.user.fullname}
              </Option>
            ))}
          </Select>
        </div>
        
        {/* Therapist information */}
        <div className="mt-6 pt-4 border-t">
          <Space direction="vertical" className="w-full">
            <div>
              <Text type="secondary" strong>Therapist:</Text>
              <Text type="secondary"> {therapist.user.fullname}</Text>
            </div>
            <div>
              <Text type="secondary" strong>Specialization:</Text>
              <Text type="secondary"> {therapist.specializations.type} - {therapist.specializations.focus}</Text>
            </div>
            <div>
              <Text type="secondary" strong>Working Hours ({getDayName()}):</Text>
              <Text type="secondary"> {therapist.availableHours[getDayName().toLowerCase()]}</Text>
            </div>
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default AppointmentModal;