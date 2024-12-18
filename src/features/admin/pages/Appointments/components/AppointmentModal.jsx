// components/AppointmentModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Select, Button, Typography, TimePicker, Space, Alert } from 'antd';
import { format } from 'date-fns';
import { parseTimeRange } from '../../../../../utils/timeHelpers';
import dayjs from 'dayjs';

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
  const [selectedTime, setSelectedTime] = useState(null);

  // Get available hours for selected day
  const getDayAvailability = () => {
    if (!selectedSlot) return null;
    
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[selectedSlot.start.getDay()];
    
    if (!therapist.availableHours[dayName]) return null;
    
    const { start, end } = parseTimeRange(therapist.availableHours[dayName]);
    return {
      start: start,
      end: end,
      dayName
    };
  };

  // Reset time when slot changes
  useEffect(() => {
    if (selectedSlot) {
      setSelectedTime(dayjs(selectedSlot.start));
    }
  }, [selectedSlot]);

  const availability = getDayAvailability();

  // Disable times outside available hours
  const disabledTime = () => {
    if (!availability) return {};
    
    const [startHour] = availability.start.split(':').map(Number);
    const [endHour] = availability.end.split(':').map(Number);
    
    const disabledHours = [];
    for (let i = 0; i < 24; i++) {
      if (i < startHour || i >= endHour) {
        disabledHours.push(i);
      }
    }
    
    return {
      disabledHours: () => disabledHours,
      disabledMinutes: () => Array.from({ length: 60 }).map((_, i) => i).filter(i => i !== 0)
    };
  };

  const handleSubmit = () => {
    if (!selectedTime) return;

    // Create end time (1 hour after start)
    const endTime = selectedTime.add(1, 'hour');

    const appointmentData = {
      ...selectedSlot,
      start: selectedTime.toDate(),
      end: endTime.toDate()
    };

    onSubmit(appointmentData);
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
          disabled={!selectedClient || !selectedTime || loading}
          loading={loading}
        >
          Create Appointment
        </Button>,
      ]}
    >
      <div className="space-y-4 py-4">
        {/* Date information */}
        {selectedSlot && (
          <Alert
            message={`Selected Date: ${format(selectedSlot.start, "PPP")}`}
            type="info"
            showIcon
            className="mb-4"
          />
        )}

        {/* Available hours information */}
        {availability && (
          <Alert
            message={`Available hours for ${availability.dayName}: ${availability.start} - ${availability.end}`}
            type="info"
            showIcon
            className="mb-4"
          />
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

        {/* Time selection */}
        <div className="mb-4">
          <Text strong className="block mb-2">Select Time</Text>
          <TimePicker
            style={{ width: '100%' }}
            format="HH:mm"
            value={selectedTime}
            onChange={setSelectedTime}
            disabledTime={disabledTime}
            hideDisabledOptions
            minuteStep={60}
            showNow={false}
            use12Hours
          />
        </div>
        
        {/* Therapist information */}
        <div className="mt-6 pt-4 border-t">
          <Text type="secondary" className="block mb-2">
            Therapist: {therapist.user.fullname}
          </Text>
          <Text type="secondary" className="block">
            Specialization: {therapist.specializations.type} - {therapist.specializations.focus}
          </Text>
        </div>
      </div>
    </Modal>
  );
};

export default AppointmentModal;