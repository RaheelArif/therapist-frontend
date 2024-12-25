import React, { useState } from "react";
import { Form, Input, DatePicker, Upload, Button, message } from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { uploadFile } from "../../../../../api/client"; // Adjust the path as needed

const BasicInfoStep = ({ form }) => {
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleUpload = async (file) => {
    try {
      setUploadLoading(true);
      const publicUrl = await uploadFile(file);

      // Update the form field with the URL
      form.setFieldsValue({
        profilePicture: publicUrl,
      });

      message.success("Profile picture uploaded successfully");
      return false; // Important: prevents Upload from making its own request
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Failed to upload profile picture");
    } finally {
      setUploadLoading(false);
    }
    return false; // Important: prevents Upload from making its own request
  };

  return (
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
            message: "Password is required",
          },
          {
            min: 8,
            message: "Password must be at least 8 characters",
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Confirm Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("The passwords do not match!"));
            },
          }),
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
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="contactNumber"
        label="Contact Number"
        rules={[
          { required: true, message: "Contact number is required" },
          {
            pattern: /^[+]?[\d\s-]+$/,
            message: "Please enter a valid phone number",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
  name="profilePicture"
  label="Profile Picture"
  rules={[{ required: true, message: 'Please upload a profile picture' }]}
>
  <Input 
    readOnly
    addonBefore={
      <Upload
        maxCount={1}
        showUploadList={false}
        beforeUpload={handleUpload}
        accept="image/*"
      >
        <Button 
          icon={uploadLoading ? <LoadingOutlined /> : <UploadOutlined />} 
          disabled={uploadLoading}
        >
          {uploadLoading ? 'Uploading...' : 'Upload Photo'}
        </Button>
      </Upload>
    }
  />
</Form.Item>
    </>
  );
};

export default BasicInfoStep;
