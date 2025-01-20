// src/components/PublicClientForm.js
import React from 'react';
import { Form, Button, Steps, message, Card } from 'antd';
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
// import axios from '../../../../../api'; // Import axios instance

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Step } = Steps;

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
        dob: moment("1995-06-15T00:00:00.000Z"),
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

const PublicClientForm = () => {
    const [form] = Form.useForm();
    const [current, setCurrent] = React.useState(0);
    const [allFormData, setAllFormData] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();


    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            const currentValues = await form.validateFields();
            const currentClientInfo = form.getFieldValue('clientInfo') || {};

            const combinedData = {
                ...allFormData,
                ...currentValues,
                password: "SecurePassword123",
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

            console.log(process.env.REACT_APP_API_BASE_URL); // Log the base URL
            const fullUrl = `${process.env.REACT_APP_API_BASE_URL}client/create-client`;
            console.log('Sending POST request to: ', fullUrl); // Log the full url

            const response = await axios.post(fullUrl, combinedData);

            form.resetFields();
            setAllFormData({});
            setCurrent(0);
            message.success('Client added successfully');
            navigate('/login');


        } catch (err) {
            console.error("Form submission error:", err);
            setError(err.message || "Please check all required fields");
        } finally {
            setLoading(false);
        }
    };

    const next = async () => {
        try {
            const values = await form.validateFields();
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
        } catch (err) {
            console.error("Validation failed:", err);
            message.error("Please fill in all required fields");
        }
    };

    const prev = () => {
        setCurrent(current - 1);
    };

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
        <Card style={{ width: "80%", margin: '20px auto' }}>
            <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
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
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        </Card>
    );
};
export default PublicClientForm;