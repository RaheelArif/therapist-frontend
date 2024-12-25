import React from "react";
import { Form, Input } from "antd";

const BasicInfoForm = () => (
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
      name="fullname"
      label="Full Name"
      rules={[{ required: true, message: "Full name is required" }]}
    >
      <Input />
    </Form.Item>
  </>
);

export { BasicInfoForm };
