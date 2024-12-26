import React, { useState } from 'react';
import { Modal, Form, Input, Upload, Button, Select, message } from 'antd';
import { updateAppointment, addDocumentNote } from '../../../api/appointment';

const { Option } = Select;

const ChangeStatusModal = ({ appointment, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Handle status change
  const handleStatusChange = async (status) => {
    try {
      setLoading(true);

      // Update the appointment status
      const updatedAppointment = await updateAppointment(appointment.id, { status });

      message.success('Appointment status updated successfully');
      onSuccess(updatedAppointment);

      // Update form status value
      form.setFieldsValue({ status });
    } catch (error) {
      console.error('Error updating appointment status:', error);
      message.error('Failed to update appointment status');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Modal
      open={true}
      title="Change Appointment Status & Add Documents"
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"

        initialValues={{ status: appointment.status }}
      >
        {/* Status Dropdown */}
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select a status' }]}
        >
          <Select onChange={handleStatusChange} disabled={loading}>
            <Option value="SCHEDULED">Scheduled</Option>
            <Option value="COMPLETED">Completed</Option>
            <Option value="CANCELED">Canceled</Option>
            <Option value="RESCHEDULED">Rescheduled</Option>
          </Select>
        </Form.Item>

   
      </Form>
    </Modal>
  );
};

export default ChangeStatusModal;
