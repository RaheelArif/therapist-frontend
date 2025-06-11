import React, { useEffect } from "react";
import { Form, Button, Steps, message } from "antd";
import moment from "moment";
import BasicInfoStep from "./BasicInfoStep";
import ProfessionalInfoStep from "./ProfessionalInfoStep";
import CertificationsStep from "./CertificationsStep";
import ScheduleStep from "./ScheduleStep";
const { Step } = Steps;

const EditTherapistForm = ({ onFinish, loading, initialValues }) => {
  const [form] = Form.useForm();
  const [current, setCurrent] = React.useState(0);

  // Load initial values for editing
  useEffect(() => {
    if (initialValues) {
      const formattedData = {
        ...initialValues,
        dateOfBirth: initialValues.dateOfBirth
          ? moment(initialValues.dateOfBirth)
          : null,
        certifications: (initialValues.certifications || []).map((cert) => ({
          ...cert,
          issueDate: cert.issueDate ? moment(cert.issueDate) : null,
          expirationDate: cert.expirationDate
            ? moment(cert.expirationDate)
            : null,
        })),
        availableHours: Object.entries(
          initialValues.availableHours || {}
        ).reduce((acc, [day, hours]) => {
          if (hours === "unavailable") {
            acc[day] = { isAvailable: false };
          } else {
            const [start, end] = hours.split("-");
            acc[day] = {
              isAvailable: true,
              start: start ? moment(start, "HH:mm") : null,
              end: end ? moment(end, "HH:mm") : null,
            };
          }
          return acc;
        }, {}),
      };
      form.setFieldsValue(formattedData);
    }
  }, [form, initialValues]);

  // Save to localStorage on form changes
  const handleFormChange = (_, allValues) => {
    localStorage.setItem("edit_therapist_form_data", JSON.stringify(allValues));
  };

  const handleSubmit = async () => {
    try {
      const allValues = form.getFieldsValue(true);
      await form.validateFields();

      const formattedValues = {
        ...allValues,
        dateOfBirth: allValues.dateOfBirth?.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        certifications: allValues.certifications?.map((cert) => ({
          ...cert,
          issueDate: cert.issueDate?.format("YYYY-MM-DD"),
          expirationDate: cert.expirationDate?.format("YYYY-MM-DD"),
        })),
        availableHours: Object.entries(allValues.availableHours || {}).reduce(
          (acc, [day, schedule]) => {
            acc[day] = schedule?.isAvailable
              ? `${schedule.start?.format("HH:mm")}-${schedule.end?.format(
                  "HH:mm"
                )}`
              : "unavailable";
            return acc;
          },
          {}
        ),
      };

      await onFinish(formattedValues);

      // Reset form after successful submission
      form.resetFields();
      setCurrent(0);
      localStorage.removeItem("edit_therapist_form_data");
      message.success("Profile updated successfully");
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
      message.error("Please fill in all required fields");
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: "Basic Info",
      content: <BasicInfoStep form={form} editMode={true} />,
    },
    {
      title: "Professional Info",
      content: <ProfessionalInfoStep />,
    },
    {
      title: "Certifications",
      content: <CertificationsStep form={form} />,
    },
    {
      title: "Schedule",
      content: <ScheduleStep />,
    },
  ];

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      onValuesChange={handleFormChange}
    >
      <Steps
        className="form-items-bx"
        current={current}
        style={{ marginBottom: 24 }}
      >
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <div className="steps-content" style={{ minHeight: "400px" }}>
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
            Update Profile
          </Button>
        )}
      </div>
    </Form>
  );
};

export default EditTherapistForm;
