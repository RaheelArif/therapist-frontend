import React, { useState } from 'react';
import { Button, Form, Upload, Input, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadFile } from '../../../../../../api/client';


const FileUploadForm = ({form}) => {
  const [uploadedFields, setUploadedFields] = useState(new Set());
  const [loadingFields, setLoadingFields] = useState(new Set());

  const handleUpload = async (file, name, form) => {
    try {
      setLoadingFields(prev => new Set([...prev, name]));

      // Log the file being uploaded
      console.log('Uploading file:', file);

      const response = await uploadFile(file);
      
      // Log the response to see its structure
      console.log('Upload response:', response);

      // Update form with the URL directly
      form.setFieldsValue({
        fileUpload: {
          [name]: {
            filename: file.name,
            fileType: file.type,
            url: response // Assuming response is the direct URL string
          }
        }
      });

      setUploadedFields(prev => new Set([...prev, name]));
      message.success(`File uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      message.error('File upload failed');
    } finally {
      setLoadingFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(name);
        return newSet;
      });
    }
  };

  const handleRemove = (name, remove) => {
    remove(name);
    setUploadedFields(prev => {
      const newSet = new Set(prev);
      newSet.delete(name);
      return newSet;
    });
  };

  return (
    <Form.List name="fileUpload">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <div 
              key={key} 
              style={{ 
                marginBottom: 16, 
                border: '1px solid #d9d9d9', 
                padding: 16, 
                borderRadius: 8,
                position: 'relative' 
              }}
            >
              <Spin spinning={loadingFields.has(name)}>
                {!uploadedFields.has(name) ? (
                  <Upload
                    beforeUpload={(file) => {
                      handleUpload(file, name, form);
                      return false;
                    }}
                    maxCount={1}
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />}>
                      {loadingFields.has(name) ? 'Uploading...' : 'Upload File'}
                    </Button>
                  </Upload>
                ) : (
                  <>
                    <Form.Item
                      {...restField}
                      name={[name, 'filename']}
                      label="File Name"
                      rules={[{ required: true }]}
                    >
                      <Input disabled />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'fileType']}
                      label="File Type"
                      rules={[{ required: true }]}
                    >
                      <Input disabled />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'url']}
                      label="URL"
                      rules={[{ required: true }]}
                    >
                      <Input disabled />
                    </Form.Item>

                    <Button 
                      type="link" 
                      danger
                      onClick={() => handleRemove(name, remove)}
                      style={{ 
                        position: 'absolute',
                        top: 8,
                        right: 8
                      }}
                    >
                      Remove
                    </Button>
                  </>
                )}
              </Spin>
            </div>
          ))}
          <Button 
            type="dashed" 
            onClick={() => add()} 
            block
            icon={<UploadOutlined />}
          >
            Add Another File
          </Button>
        </>
      )}
    </Form.List>
  );
};

export { FileUploadForm };