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
import { ConsultantType, getEnumValues } from "./constants";
const ComplaintForm = () => (
  <Form.List name="complaint">
    {(fields, { add, remove }) => (
      <>
        {fields.map(({ key, name, ...restField }) => (
          <div
            key={key}
            style={{
              marginBottom: 16,
              border: "1px solid #d9d9d9",
              padding: 16,
              borderRadius: 8,
            }}
          >
            <Form.Item
              {...restField}
              name={[name, "description"]}
              label="Description"
              rules={[{ required: true }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, "startDate"]}
              label="Start Date"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, "expectations"]}
              label="Expectations"
              rules={[{ required: true }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, "hasPreviousConsultation"]}
              label="Has Previous Consultation"
              valuePropName="checked"
              rules={[{ required: true }]}
            >
              <Switch />
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, "consultantTypes"]}
              label="Consultant Types"
              rules={[{ required: true }]}
            >
              <Select mode="multiple">
                {getEnumValues(ConsultantType).map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, "previousDiagnosis"]}
              label="Previous Diagnosis"
            >
              <Input.TextArea />
            </Form.Item>
            <Button type="link" onClick={() => remove(name)} block>
              Remove Complaint
            </Button>
          </div>
        ))}
        <Button type="dashed" onClick={() => add()} block>
          Add Complaint
        </Button>
      </>
    )}
  </Form.List>
);

export { ComplaintForm };
