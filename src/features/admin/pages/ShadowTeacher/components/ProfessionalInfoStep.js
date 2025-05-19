// components/TherapistForm/ProfessionalInfoStep.js
import React from 'react';
import { Form, Input, InputNumber, Select } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const languages = [
    'Indonesian',
    'English',
    'Mandarin',
    'Other'
  ];
  
  const specializationTypes = [
    'CBT',
    'DBT',
    'Psychodynamic',
    'Humanistic',
    'Behavioral',
    'Family Systems',
    'Other'
  ];
  

const ProfessionalInfoStep = () => (
  <>
    <Form.Item
      name="experience"
      label="Years of Experience"
      rules={[{ required: true, message: "Experience is required" }]}
    >
      <InputNumber min={0} max={50} style={{ width: '100%' }} />
    </Form.Item>

    <Form.Item
      name="bio"
      label="Professional Bio"
      rules={[
        { required: true, message: "Bio is required" },
        { min: 50, message: "Bio should be at least 50 characters" }
      ]}
    >
      <TextArea rows={4} maxLength={500} showCount />
    </Form.Item>

    <Form.Item
      name="languagesSpoken"
      label="Languages Spoken"
      rules={[{ required: true, message: "Please select at least one language" }]}
    >
      <Select 
        mode="multiple" 
        placeholder="Select languages"
        allowClear
      >
        {languages.map(lang => (
          <Option key={lang} value={lang}>{lang}</Option>
        ))}
      </Select>
    </Form.Item>

    <Form.Item
      name={['specializations', 'type']}
      label="Specialization Type"
      rules={[{ required: true, message: "Specialization type is required" }]}
    >
      <Select placeholder="Select specialization">
        {specializationTypes.map(type => (
          <Option key={type} value={type}>{type}</Option>
        ))}
      </Select>
    </Form.Item>

    <Form.Item
      name={['specializations', 'focus']}
      label="Focus Areas"
      rules={[
        { required: true, message: "Focus areas are required" },
        { min: 10, message: "Please provide more detail about your focus areas" }
      ]}
    >
      <TextArea 
        rows={3} 
        placeholder="e.g., Anxiety, Depression, PTSD, Relationship Issues" 
      />
    </Form.Item>

    <Form.Item
      name="workAddress"
      label="Work Address"
      rules={[{ required: true, message: "Work address is required" }]}
    >
      <TextArea rows={2} />
    </Form.Item>
  </>
);

export default ProfessionalInfoStep;