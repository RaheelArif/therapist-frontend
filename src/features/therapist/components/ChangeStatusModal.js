import React, { useState } from 'react';
import { Modal, Form, Input, Upload, Button, Select, message } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { updateAppointment, addDocumentNote } from '../../../api/appointment';
import { uploadFile } from '../../../api/client'; // Adjust this path based on your project structure

const { Option } = Select;

const ChangeStatusModal = ({ appointment, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

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

  // Handle file upload
  const handleUpload = async (file) => {
    try {
      setUploadLoading(true);
      const publicUrl = await uploadFile(file);

      // Set the uploaded file URL in the form
      form.setFieldsValue({ pdfLink: publicUrl });

      message.success('Document uploaded successfully');
      return false; // Prevent Upload from making its own request
    } catch (error) {
      console.error('Error uploading document:', error);
      message.error('Failed to upload document');
    } finally {
      setUploadLoading(false);
    }
    return false; // Prevent Upload from making its own request
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Prepare payload
      const payload = {
        notes: values.notes,
        documentLink: values.pdfLink,
      };

      // Add document note
      const response = await addDocumentNote(appointment.id, payload);

      message.success('Document and notes added successfully');
      onSuccess(response);
    } catch (error) {
      console.error('Error adding document note:', error);
      message.error('Failed to add document and notes');
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
        onFinish={handleSubmit}
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

        {/* Notes Input */}
        <Form.Item
          name="notes"
          label="Notes"
          rules={[{ required: true, message: 'Please add a note' }]}
        >
          <Input.TextArea rows={3} placeholder="Add any notes" />
        </Form.Item>

        {/* File Upload */}
        <Form.Item
          name="pdfLink"
          label="Attach Document"
          rules={[{ required: true, message: 'Please upload a document' }]}
        >
          <Input
            readOnly
            addonBefore={
              <Upload
                maxCount={1}
                showUploadList={false}
                beforeUpload={handleUpload}
                accept=".pdf"
              >
                <Button
                  icon={uploadLoading ? <LoadingOutlined /> : <UploadOutlined />}
                  disabled={uploadLoading}
                >
                  {uploadLoading ? 'Uploading...' : 'Upload PDF'}
                </Button>
              </Upload>
            }
          />
        </Form.Item>

        {/* Save Changes Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangeStatusModal;
