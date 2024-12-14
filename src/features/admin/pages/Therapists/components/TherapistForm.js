// components/TherapistForm/index.js
import React, { useEffect } from 'react';
import { Form, Button, Steps, message } from 'antd';
import moment from 'moment';
import BasicInfoStep from './BasicInfoStep';
import ProfessionalInfoStep from './ProfessionalInfoStep';
import CertificationsStep from './CertificationsStep';
import ScheduleStep from './ScheduleStep';
const { Step } = Steps;

// Default values for testing
const defaultValues = {
  // Basic Info
  email: "therapist.test@example.com",
  password: "SecurePass123",
  fullName: "Dr. Jane Smith",
  dateOfBirth: moment("1985-06-15"),
  contactNumber: "+1234567890",
  
  // Professional Info
  experience: 8,
  bio: "Experienced therapist specializing in cognitive behavioral therapy.",
  languagesSpoken: ["English", "Indonesian"], // Updated to match API requirements
  specializations: {
    type: "CBT",
    focus: "Anxiety, Depression, PTSD"
  },
  workAddress: "123 Therapy Street, Medical District",
  
  // Certifications
  certifications: [
    {
      title: "Clinical Psychology License",
      issuer: "State Board of Psychology",
      issueDate: moment("2015-01-01"),
      expirationDate: moment("2025-01-01"),
      description: "Licensed Clinical Psychologist"
    }
  ],
  
  // Schedule
  availableHours: {
    monday: { isAvailable: true, start: moment('09:00', 'HH:mm'), end: moment('17:00', 'HH:mm') },
    tuesday: { isAvailable: true, start: moment('09:00', 'HH:mm'), end: moment('17:00', 'HH:mm') },
    wednesday: { isAvailable: true, start: moment('09:00', 'HH:mm'), end: moment('17:00', 'HH:mm') },
    thursday: { isAvailable: true, start: moment('09:00', 'HH:mm'), end: moment('17:00', 'HH:mm') },
    friday: { isAvailable: true, start: moment('09:00', 'HH:mm'), end: moment('15:00', 'HH:mm') },
    saturday: { isAvailable: false },
    sunday: { isAvailable: false }
  }
};



const TherapistForm = ({ onFinish, loading = false }) => {
  const [form] = Form.useForm();
  const [current, setCurrent] = React.useState(0);

  // Load saved form data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('therapist_form_data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Convert date strings back to moment objects
        const formattedData = {
          ...parsedData,
          dateOfBirth: parsedData.dateOfBirth ? moment(parsedData.dateOfBirth) : null,
          certifications: (parsedData.certifications || []).map(cert => ({
            ...cert,
            issueDate: cert.issueDate ? moment(cert.issueDate) : null,
            expirationDate: cert.expirationDate ? moment(cert.expirationDate) : null
          }))
        };
        form.setFieldsValue(formattedData);
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, [form]);

  // Save to localStorage on form changes
  const handleFormChange = (_, allValues) => {
    localStorage.setItem('therapist_form_data', JSON.stringify(allValues));
  };

  const handleSubmit = async () => {
    try {
      // Get all form values first
      const allValues = form.getFieldsValue(true);
      
      // Validate all fields
      await form.validateFields();
      
      // Format dates and times for API
      const formattedValues = {
        // Basic Info
        email: allValues.email,
        password: allValues.password,
        fullName: allValues.fullName,
        dateOfBirth: allValues.dateOfBirth?.format("YYYY-MM-DDTHH:mm:ss.SSSZ"), // ISO-8601 format
        contactNumber: allValues.contactNumber,
        
        // Professional Info
        experience: allValues.experience,
        bio: allValues.bio,
        languagesSpoken: allValues.languagesSpoken,
        specializations: allValues.specializations,
        workAddress: allValues.workAddress,
        
        // Certifications
        certifications: allValues.certifications?.map(cert => ({
          ...cert,
          issueDate: cert.issueDate?.format("YYYY-MM-DD"),
          expirationDate: cert.expirationDate?.format("YYYY-MM-DD")
        })),
        
        // Schedule - Format as strings "HH:mm-HH:mm" or "unavailable"
        availableHours: Object.entries(allValues.availableHours || {}).reduce((acc, [day, schedule]) => {
          acc[day] = schedule?.isAvailable ? 
            `${schedule.start?.format("HH:mm")}-${schedule.end?.format("HH:mm")}` : 
            "unavailable";
          return acc;
        }, {})
      };

      console.log('Submitting form data:', formattedValues);
      await onFinish(formattedValues);
      
      // Clear storage after successful submission
      localStorage.removeItem('therapist_form_data');
    } catch (error) {
      console.error("Form submission error:", error);
      message.error("Please check all required fields in all steps");
    }
  };

  const next = async () => {
    try {
      await form.validateFields();
      setCurrent(current + 1);
    } catch (error) {
      message.error('Please fill in all required fields');
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: 'Basic Info',
      content: <BasicInfoStep />
    },
    {
      title: 'Professional Info',
      content: <ProfessionalInfoStep />
    },
    {
      title: 'Certifications',
      content: <CertificationsStep />
    },
    {
      title: 'Schedule',
      content: <ScheduleStep />
    }
  ];

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      initialValues={defaultValues}
      onValuesChange={handleFormChange}
    >
      <Steps current={current} style={{ marginBottom: 24 }}>
        {steps.map(item => (
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

export default TherapistForm;