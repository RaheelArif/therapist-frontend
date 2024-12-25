// ClientForm.js
import React from 'react';
import { Form, Button, Steps, message } from 'antd';
import moment from 'moment';
import {
  BasicInfoForm,
  FormFillerInfo,
  ClientInfoForm,
  SiblingForm,
  ParentForm,
  ComplaintForm,
  FileUploadForm,
} from './components';

const { Step } = Steps;

// We don't need the formatDate function anymore as we're using simpler date formatting

const defaultValues = {
  email: "client.1@example.com",
  password: "SecurePassword123",
  fullname: "John Doe",
  formFiller: {
    identity: "Mom",
    fullName: "Jane Smith",
    contactNumber: "+123456789",
    address: "123 Main St, Test City"
  },
  clientInfo: {
    fullName: "John Doe",
    gender: "Male",
    dob: moment("1995-06-15T00:00:00.000Z"),  // Use full ISO string
    siblingsCount: 3,
    birthOrder: 2,
    placeOfBirth: "Test City",
    timeOfBirth: moment("09:00:00", "HH:mm:ss"),
    age: 29,
    education: "HighSchool",
    educationInstitute: "Test High School",
    everydayLanguage: ["English", "Indonesian"],
    religion: "Christianity",
    siblings: [
      {
        name: "Anna Doe",
        gender: "Female",
        age: 27,
        occupation: "Engineer"
      }
    ]
  },
  parentInformation: [
    {
      age: 55,
      placeOfBirth: "Test City",
      siblingsCount: 4,
      birthOrder: 2,
      marriageCount: 1,
      relationShip: "Father",
      tribe: "Tribe A",
      occupation: "Doctor",
      homePhoneNumber: "+987654321",
      name: "Robert Doe",
      lastEducation: "Master's Degree",
      homeAddress: "456 Elm St, Test City"
    }
  ],
  fileUpload: [
    {
      filename: "document.pdf",
      fileType: "application/pdf",
      url: "https://example.com/document.pdf"
    }
  ],
  complaint: [
    {
      description: "Frequent headaches and dizziness.",
      startDate: moment("1995-06-15"),
      expectations: "Better clarity on health issues",
      hasPreviousConsultation: true,
      consultantTypes: ["Psychologist"],
      previousDiagnosis: "Stress-related disorder"
    }
  ]
};

const ClientForm = ({ onFinish, loading = false }) => {
  const [form] = Form.useForm();
  const [current, setCurrent] = React.useState(0);
  const [allFormData, setAllFormData] = React.useState({}); 
   
  const handleSubmit = async () => {
    try {
      const currentValues = await form.validateFields();
      const currentClientInfo = form.getFieldValue('clientInfo') || {};
      
      // Combine all form data
      const combinedData = {
        ...allFormData,
        ...currentValues,
        password: "SecurePassword123", // Always set this password
        clientInfo: {
          ...allFormData.clientInfo,
          ...currentClientInfo,
          dob: currentClientInfo?.dob ? moment(currentClientInfo.dob).format("YYYY-MM-DDTHH:mm:ss.SSSZ") : null,
          timeOfBirth: currentClientInfo?.timeOfBirth ? currentClientInfo.timeOfBirth.format("HH:mm:ss") : null,
        },
        complaint: (currentValues.complaint || []).map(complaint => ({
          ...complaint,
          startDate: complaint.startDate ? moment(complaint.startDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ") : null,
        })),
        fileUpload: currentValues.fileUpload || allFormData.fileUpload || [],
        parentInformation: currentValues.parentInformation || allFormData.parentInformation || [],
      };

      if (!combinedData.clientInfo.dob) {
        throw new Error('Date of Birth is required');
      }

      await onFinish(combinedData);
      
      // Reset form after successful submission
      form.resetFields();
      setAllFormData({});
      setCurrent(0);
      message.success('Form submitted successfully');
    } catch (error) {
      console.error("Form submission error:", error);
      message.error(error.message || "Please check all required fields");
    }
  };

  const next = async () => {
    try {
      // Validate current step
      const values = await form.validateFields();
      
      // Update the accumulated form data
      setAllFormData(prev => ({
        ...prev,
        ...values,
        clientInfo: {
          ...prev.clientInfo,
          ...values.clientInfo
        },
        parentInformation: values.parentInformation || prev.parentInformation,
        complaint: values.complaint || prev.complaint,
        fileUpload: values.fileUpload || prev.fileUpload,
      }));

      setCurrent(current + 1);
    } catch (error) {
      console.error("Validation failed:", error);
      message.error("Please fill in all required fields");
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  // Save form data on every change
  const handleFormChange = (changedValues, allValues) => {
    setAllFormData(prev => ({
      ...prev,
      ...allValues,
      clientInfo: {
        ...prev.clientInfo,
        ...allValues.clientInfo
      },
      parentInformation: allValues.parentInformation || prev.parentInformation || defaultValues.parentInformation,
      complaint: allValues.complaint || prev.complaint || [],
      fileUpload: allValues.fileUpload || prev.fileUpload || [],
    }));
  };

  const steps = [
    {
      title: "Basic Info",
      content: <BasicInfoForm />
    },
    {
      title: "Form Filler",
      content: <FormFillerInfo />
    },
    {
      title: "Client Info",
      content: (
        <>
          <ClientInfoForm />
          <h3>Siblings Information</h3>
          <SiblingForm />
        </>
      )
    },
    {
      title: "Parent Info",
      content: <ParentForm />
    },
    {
      title: "Complaints",
      content: <ComplaintForm />
    },
    {
      title: "Documents",
      content: <FileUploadForm form={form} />
    }
  ];
  const fillTestValues = () => {
    form.setFieldsValue(defaultValues);
    setAllFormData(defaultValues);
    message.success('Test values loaded');
  };
  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      // initialValues={allFormData}
      onValuesChange={handleFormChange}
    >
       <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button onClick={fillTestValues} type="dashed">
          Load Test Values
        </Button>
      </div>
      <Steps current={current} style={{ marginBottom: 24 }}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <div className="steps-content" style={{ minHeight: '400px' }}>
        {steps[current].content}
      </div>

      <div style={{ marginTop: 24 }} className="steps-action">
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