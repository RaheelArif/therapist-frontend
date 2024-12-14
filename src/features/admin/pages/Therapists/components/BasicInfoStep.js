// components/TherapistForm/BasicInfoStep.js
import React from 'react';
import { Form, Input, DatePicker, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const BasicInfoStep = () => (
  <>
    <Form.Item
      name="email"
      label="Email"
      rules={[
        {
          required: true,
          type: "email",
          message: "Please enter a valid email",
        },
      ]}
    >
      <Input />
    </Form.Item>
    
    <Form.Item
      name="password"
      label="Password"
      rules={[
        { 
          required: true,
          message: "Password is required"
        },
        {
          min: 8,
          message: "Password must be at least 8 characters"
        }
      ]}
    >
      <Input.Password />
    </Form.Item>
    
    <Form.Item
      name="fullName"
      label="Full Name"
      rules={[{ required: true, message: "Full name is required" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      name="dateOfBirth"
      label="Date of Birth"
      rules={[{ required: true, message: "Date of birth is required" }]}
    >
      <DatePicker style={{ width: '100%' }} />
    </Form.Item>

    <Form.Item
      name="contactNumber"
      label="Contact Number"
      rules={[
        { required: true, message: "Contact number is required" },
        {
          pattern: /^[+]?[\d\s-]+$/,
          message: "Please enter a valid phone number"
        }
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      name="profilePicture"
      label="Profile Picture"
    >
      <Upload 
        maxCount={1}
        beforeUpload={() => false} // Prevent auto upload
        accept="image/*"
      >
        <Button icon={<UploadOutlined />}>Upload Photo</Button>
      </Upload>
    </Form.Item>
  </>
);

export default BasicInfoStep;