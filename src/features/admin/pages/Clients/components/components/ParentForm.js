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
import { RelationShip, getEnumValues } from './constants';
const ParentForm = () => (
  <Form.List name="parentInformation">
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
              name={[name, "relationShip"]}
              label="Relationship"
              rules={[{ required: true }]}
            >
              <Select>
                {getEnumValues(RelationShip).map((relation) => (
                  <Select.Option key={relation} value={relation}>
                    {relation}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, "name"]}
              label="Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, "age"]}
              label="Age"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, "placeOfBirth"]}
              label="Place of Birth"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, "siblingsCount"]}
              label="Number of Siblings"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, "birthOrder"]}
              label="Birth Order"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "100%" }} min={1} />
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, "marriageCount"]}
              label="Marriage Count"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "100%" }} min={1} />
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, "tribe"]}
              label="Tribe"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, "occupation"]}
              label="Occupation"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, "lastEducation"]}
              label="Last Education"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, "homeAddress"]}
              label="Home Address"
              rules={[{ required: true }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, "homePhoneNumber"]}
              label="Home Phone Number"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Button type="link" onClick={() => remove(name)} block>
              Remove Parent
            </Button>
          </div>
        ))}
        <Button type="dashed" onClick={() => add()} block>
          Add Parent
        </Button>
      </>
    )}
  </Form.List>
);

export { ParentForm };
