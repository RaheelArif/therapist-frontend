import { Button, DatePicker, Form, Input, InputNumber, Select, Switch, TimePicker } from 'antd';



const FileUploadForm = () => (
    <Form.List name="fileUpload">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <div key={key} style={{ marginBottom: 16, border: '1px solid #d9d9d9', padding: 16, borderRadius: 8 }}>
              <Form.Item
                {...restField}
                name={[name, 'filename']}
                label="File Name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, 'fileType']}
                label="File Type"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, 'url']}
                label="URL"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Button type="link" onClick={() => remove(name)} block>
                Remove File
              </Button>
            </div>
          ))}
          <Button type="dashed" onClick={() => add()} block>
            Add File
          </Button>
        </>
      )}
    </Form.List>
  );


export {
  
    FileUploadForm
  };