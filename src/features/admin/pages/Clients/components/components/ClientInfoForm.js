import React from "react";
import { DatePicker, Form, Input, InputNumber, Select, TimePicker } from "antd";
import { Gender, Language, Education , getEnumValues } from './constants';
const ClientInfoForm = () => (
  <>
    <Form.Item
      name={["clientInfo", "fullName"]}
      label="Full Name"
      rules={[{ required: true }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name={["clientInfo", "gender"]}
      label="Gender"
      rules={[{ required: true }]}
    >
      <Select>
        {getEnumValues(Gender).map((gender) => (
          <Select.Option key={gender} value={gender}>
            {gender}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
    <Form.Item
      name={["clientInfo", "dob"]}
      label="Date of Birth"
      rules={[{ required: true }]}
    >
      <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
    </Form.Item>
    <Form.Item
      name={["clientInfo", "timeOfBirth"]}
      label="Time of Birth"
      rules={[{ required: true }]}
    >
      <TimePicker style={{ width: "100%" }} format="HH:mm:ss" />
    </Form.Item>
    <Form.Item
      name={["clientInfo", "age"]}
      label="Age"
      rules={[{ required: true }]}
    >
      <InputNumber style={{ width: "100%" }} />
    </Form.Item>
    <Form.Item
      name={["clientInfo", "placeOfBirth"]}
      label="Place of Birth"
      rules={[{ required: true }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name={["clientInfo", "siblingsCount"]}
      label="Number of Siblings"
      rules={[{ required: true }]}
    >
      <InputNumber style={{ width: "100%" }} min={0} />
    </Form.Item>
    <Form.Item
      name={["clientInfo", "birthOrder"]}
      label="Birth Order"
      rules={[{ required: true }]}
    >
      <InputNumber style={{ width: "100%" }} min={1} />
    </Form.Item>
    <Form.Item
      name={["clientInfo", "religion"]}
      label="Religion"
      rules={[{ required: true }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
  name={['clientInfo', 'education']}
  label="Education"
  rules={[{ required: true }]}
>
  <Select>
    {getEnumValues(Education).map((edu) => (
      <Select.Option key={edu} value={edu}>
        {edu}
      </Select.Option>
    ))}
  </Select>
</Form.Item>
    <Form.Item
      name={["clientInfo", "educationInstitute"]}
      label="Education Institute"
      rules={[{ required: true }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name={["clientInfo", "everydayLanguage"]}
      label="Languages"
      rules={[{ required: true }]}
    >
      <Select mode="multiple">
        {getEnumValues(Language).map((lang) => (
          <Select.Option key={lang} value={lang}>
            {lang}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  </>
);

export { ClientInfoForm };
