import React, { useState } from 'react';
import { Modal, Form, Input, Upload, Button, List, Typography, message } from 'antd';
import { UploadOutlined, LoadingOutlined, DownloadOutlined } from '@ant-design/icons';
import { addDocumentNote } from '../../../api/appointment';
import {uploadFile } from '../../../api/client';

const { Text } = Typography;

const AddDocumentsModal = ({ appointment, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleUpload = async (file) => {
    try {
      setUploadLoading(true);
      const publicUrl = await uploadFile(file);
      form.setFieldsValue({ pdfLink: publicUrl });
      message.success('Document uploaded successfully');
      return false;
    } catch (error) {
      console.error('Error uploading document:', error);
      message.error('Failed to upload document');
    } finally {
      setUploadLoading(false);
    }
    return false;
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        notes: values.notes,
        documentLink: values.pdfLink,
      };
      const response = await addDocumentNote(appointment.id, payload);
      message.success('Document and notes added successfully');
      onSuccess(response);
    } catch (error) {
      console.error('Error adding document note:', error);
      message.error('Failed to save document and notes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={true}
      title="Add/View Documents & Notes"
      onCancel={onClose}
      footer={null}
    >
      {/* Display Existing Documents */}
      <List
        header={<Text strong>Previous Documents</Text>}
        bordered
        dataSource={appointment.documents}
        renderItem={(doc) => (
          <List.Item
            actions={[
              doc.pdfLink ? (
                <Button
                  type="link"
                  href={doc.pdfLink}
                  target="_blank"
                  icon={<DownloadOutlined />}
                >
                  Download
                </Button>
              ) : null,
            ]}
          >
            <List.Item.Meta
              title={`Notes: ${doc.notes || 'No notes provided'}`}
              description={`Added on: ${new Date(doc.createdAt).toLocaleString()}`}
            />
          </List.Item>
        )}
      />

      {/* Form to Add New Document */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: '20px' }}
      >
        <Form.Item
          name="notes"
          label="Notes"
          rules={[{ required: true, message: 'Please add notes' }]}
        >
          <Input.TextArea rows={3} placeholder="Add any notes" />
        </Form.Item>

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

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDocumentsModal;
