// src/features/admin/pages/Clients/components/ClientForm.js
import React from "react";
import {
  Form,
  Input,
  Button,
  Steps,
  Select,
  DatePicker,
  InputNumber,
} from "antd";
import moment from "moment";

const { Step } = Steps;

const EDUCATION = {
  Preschool: "Preschool",
  Kindergarten: "Kindergarten",
  LowerSchool: "LowerSchool",
  MiddleSchool: "MiddleSchool",
  HighSchool: "HighSchool",
  Other: "Other",
};

const LANGUAGES = {
  Indonesian: "Indonesian",
  English: "English",
  Mandarin: "Mandarin",
  Other: "Other",
};

const defaultValues = {
  email: "test@example.com",
  password: "Test123!",
  fullname: "Test User",
  formFiller: {
    identity: "Parent",
    fullName: "Parent Name",
    contactNumber: "1234567890",
    address: "Test Address",
  },
  clientInfo: {
    fullName: "Client Name",
    gender: "Male",
    placeOfBirth: "Test City",
    education: "HighSchool",
    everydayLanguage: ["Indonesian"],
    age: 25,
    dob: moment(),
  },
  parentInformation: [
    {
      age: 50,
      placeOfBirth: "Test City",
      siblingsCount: 2,
      marriageCount: 1,
      tribe: "Test Tribe",
      lastEducation: "University",
      homeAddress: "Test Address",
      occupation: "Test Job",
      homePhoneNumber: "1234567890",
      name: "Parent Name",
    },
  ],
  fileUpload: [
    {
      url: "https://example.com/test.pdf",
      fileType: "PDF",
      filename: "test",
    },
  ],
};

const ClientForm = ({ onFinish, loading }) => {
  const [form] = Form.useForm();
  const [current, setCurrent] = React.useState(0);
  const [formData, setFormData] = React.useState({});

  const handleSubmit = (values) => {
    const payload = {
      ...formData,
      ...values,
      clientInfo: {
        ...formData.clientInfo,
        ...values.clientInfo,
        dob: moment(values.clientInfo?.dob).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        age: parseInt(values.clientInfo?.age),
      },
    };

    // Remove password from network logs
    console.log("Submitting:", { ...payload, password: "[REDACTED]" });
    onFinish(payload);
  };

  const next = async () => {
    try {
      const values = await form.validateFields();
      setFormData((prev) => ({ ...prev, ...values }));
      setCurrent(current + 1);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: "Basic Info",
      content: (
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
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="fullname"
            label="Full Name"
            rules={[{ required: true, message: "Full name is required" }]}
          >
            <Input />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Form Filler",
      content: (
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
      ),
    },
    {
      title: "Client Info",
      content: (
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
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
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
            name={["clientInfo", "education"]}
            label="Education"
            rules={[{ required: true }]}
          >
            <Select>
              {Object.values(EDUCATION).map((edu) => (
                <Select.Option key={edu} value={edu}>
                  {edu}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name={["clientInfo", "everydayLanguage"]}
            label="Languages"
            rules={[{ required: true }]}
          >
            <Select mode="multiple">
              {Object.values(LANGUAGES).map((lang) => (
                <Select.Option key={lang} value={lang}>
                  {lang}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </>
      ),
    },
  ];

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      initialValues={defaultValues}
      onValuesChange={(_, allValues) => {
        setFormData((prev) => ({ ...prev, ...allValues }));
      }}
    >
      <Steps current={current} style={{ marginBottom: 24 }}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <div>{steps[current].content}</div>

      <div style={{ marginTop: 24 }}>
        {current > 0 && (
          <Button style={{ marginRight: 8 }} onClick={prev}>
            Previous
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        )}
      </div>
    </Form>
  );
};

export default ClientForm;
