// components/TherapistForm/ScheduleStep.js
import React from 'react';
import { Form, TimePicker, Switch, Card, Space } from 'antd';
import moment from 'moment';

const days = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
];

const format = 'HH:mm';

const ScheduleStep = () => (
  <Space direction="vertical" style={{ width: '100%' }}>
    {days.map(({ key, label }) => (
      <Card key={key} size="small" title={label}>
        <Space align="baseline">
          <Form.Item
            name={['availableHours', key, 'isAvailable']}
            valuePropName="checked"
          >
            <Switch checkedChildren="Available" unCheckedChildren="Unavailable" />
          </Form.Item>

          <Form.Item noStyle dependencies={[['availableHours', key, 'isAvailable']]}>
            {({ getFieldValue }) => {
              const isAvailable = getFieldValue(['availableHours', key, 'isAvailable']);
              
              if (!isAvailable) {
                return null;
              }

              return (
                <Space>
                  <Form.Item
                    name={['availableHours', key, 'start']}
                    rules={[{ required: isAvailable, message: 'Start time required' }]}
                  >
                    <TimePicker format={format} />
                  </Form.Item>
                  <span>to</span>
                  <Form.Item
                    name={['availableHours', key, 'end']}
                    rules={[{ required: isAvailable, message: 'End time required' }]}
                  >
                    <TimePicker format={format} />
                  </Form.Item>
                </Space>
              );
            }}
          </Form.Item>
        </Space>
      </Card>
    ))}
  </Space>
);

export default ScheduleStep;