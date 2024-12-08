import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  TimePicker,
} from "antd";

const FormFillerInfo = () => (
  <>
    <Form.Item
      name={["formFiller", "identity"]}
      label="Identity"
      rules={[{ required: true }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name={["formFiller", "fullName"]}
      label="Full Name"
      rules={[{ required: true }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name={["formFiller", "contactNumber"]}
      label="Contact Number"
      rules={[{ required: true }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name={["formFiller", "address"]}
      label="Address"
      rules={[{ required: true }]}
    >
      <Input.TextArea />
    </Form.Item>
  </>
);

export { FormFillerInfo };
