// components/TherapistForm/CertificationsStep.js
import React from 'react';
import { Form, Input, DatePicker, Button, Space, Upload } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const CertificationsStep = () => (
  <Form.List
    name="certifications"
    initialValue={[{}]} // Start with one empty certification
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
                rules={[{ required: true, message: 'Title is required' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                {...restField}
                name={[name, 'issuer']}
                label="Issuing Organization"
                rules={[{ required: true, message: 'Issuer is required' }]}
              >
                <Input />
              </Form.Item>

              <Space style={{ width: '100%' }} size="large">
                <Form.Item
                  {...restField}
                  name={[name, 'issueDate']}
                  label="Issue Date"
                  rules={[{ required: true, message: 'Issue date is required' }]}
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
                <Upload 
                  maxCount={1}
                  beforeUpload={() => false}
                  accept=".pdf,.jpg,.jpeg,.png"
                >
                  <Button icon={<UploadOutlined />}>Upload Certificate</Button>
                </Upload>
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

export default CertificationsStep;