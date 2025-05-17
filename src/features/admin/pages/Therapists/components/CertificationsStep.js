import React, { useState } from 'react';
import { Form, Input, DatePicker, Button, Space, Upload, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { uploadFile } from '../../../../../api/client'; // Adjust path as needed

const { TextArea } = Input;

const CertificationsStep = ({ form }) => {
  const [uploadingFields, setUploadingFields] = useState(new Set());

  const handleUpload = async (file, fieldName) => {
    try {
      setUploadingFields(prev => new Set([...prev, fieldName]));
      const publicUrl = await uploadFile(file);

      // Update the specific certification's attachmentUrl
      const certifications = form.getFieldValue('certifications');
      certifications[fieldName].attachmentUrl = publicUrl;
      form.setFieldsValue({ certifications });

      message.success('Certificate uploaded successfully');
      return false; // Prevent default upload
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Failed to upload certificate');
    } finally {
      setUploadingFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(fieldName);
        return newSet;
      });
    }
    return false;
  };

  return (
    <Form.List
      name="certifications"
      initialValue={[{}]}
    >
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <div key={key} style={{ marginBottom: 24, border: '1px solid #f0f0f0', padding: 24, borderRadius: 8 }}>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Form.Item
                  {...restField}
                  name={[name, 'title']}
                  label="Certification Title"
                  // rules removed
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'issuer']}
                  label="Issuing Organization"
                  // rules removed
                >
                  <Input />
                </Form.Item>

                <Space style={{ width: '100%' }} size="large">
                  <Form.Item
                    {...restField}
                    name={[name, 'issueDate']}
                    label="Issue Date"
                    // rules removed
                    style={{ width: '100%' }}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'expirationDate']}
                    label="Expiration Date"
                    style={{ width: '100%' }}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Space>

                <Form.Item
                  {...restField}
                  name={[name, 'description']}
                  label="Description"
                >
                  <TextArea rows={3} />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'attachmentUrl']}
                  label="Certificate Document"
                >
                  <Input
                    readOnly
                    placeholder="Upload a file to see its URL here"
                    value={form.getFieldValue(['certifications', name, 'attachmentUrl']) || ''}
                    addonBefore={
                      <Upload
                        maxCount={1}
                        showUploadList={false}
                        beforeUpload={(file) => handleUpload(file, name)}
                        accept=".pdf,.jpg,.jpeg,.png"
                      >
                        <Button
                          icon={uploadingFields.has(name) ? <LoadingOutlined /> : <UploadOutlined />}
                          disabled={uploadingFields.has(name)}
                        >
                          {uploadingFields.has(name) ? 'Uploading...' : 'Upload Certificate'}
                        </Button>
                      </Upload>
                    }
                  />
                </Form.Item>

                {fields.length > 1 && (
                  <Button
                    type="text"
                    danger
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(name)}
                  >
                    Remove this certification
                  </Button>
                )}
              </Space>
            </div>
          ))}

          <Form.Item>
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
            >
              Add Certification
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default CertificationsStep;