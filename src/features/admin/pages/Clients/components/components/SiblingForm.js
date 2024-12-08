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

const SiblingForm = () => (
  <Form.List name={["clientInfo", "siblings"]}>
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
              name={[name, "name"]}
              label="Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, "gender"]}
              label="Gender"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="Male">Male</Select.Option>
                <Select.Option value="Female">Female</Select.Option>
              </Select>
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
              name={[name, "occupation"]}
              label="Occupation"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Button type="link" onClick={() => remove(name)} block>
              Remove Sibling
            </Button>
          </div>
        ))}
        <Button type="dashed" onClick={() => add()} block>
          Add Sibling
        </Button>
      </>
    )}
  </Form.List>
);

export { SiblingForm };
