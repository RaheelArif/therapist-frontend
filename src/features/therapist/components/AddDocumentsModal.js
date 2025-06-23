import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Upload,
  Button,
  Timeline,
  Typography,
  message,
  Space,
} from "antd";
import {
  UploadOutlined,
  LoadingOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { addDocumentNote } from "../../../api/appointment";
import { uploadFile } from "../../../api/client";

const { Text } = Typography;

const AddDocumentsModal = ({ appointment, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const getFileType = (url) => {
    if (!url) return "unknown";
    const extension = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png"].includes(extension)) return "image";
    if (["mp4", "mov"].includes(extension)) return "video";
    if (extension === "pdf") return "pdf";
    return "unknown";
  };

  const renderFile = (doc) => {
    const fileType = getFileType(doc.pdfLink);
    switch (fileType) {
      case "image":
        return (
          <img
            src={doc.pdfLink}
            alt="document"
            style={{ maxWidth: "200px", maxHeight: "200px", marginTop: "8px" }}
          />
        );
      case "video":
        return (
          <video
            controls
            style={{ maxWidth: "200px", maxHeight: "200px", marginTop: "8px" }}
          >
            <source
              src={doc.pdfLink}
              type={`video/${doc.pdfLink.split(".").pop().toLowerCase()}`}
            />
            Your browser does not support the video tag.
          </video>
        );
      case "pdf":
        return (
          <Button
            type="link"
            href={doc.pdfLink}
            target="_blank"
            icon={<DownloadOutlined />}
            style={{ marginTop: "8px" }}
          >
            Download PDF
          </Button>
        );
      default:
        return <Text type="secondary">No preview available</Text>;
    }
  };

  const handleUpload = async (file) => {
    try {
      setUploadLoading(true);
      const publicUrl = await uploadFile(file);
      form.setFieldsValue({ pdfLink: publicUrl });
      message.success("Document uploaded successfully");
      return false;
    } catch (error) {
      console.error("Error uploading document:", error);
      message.error("Failed to upload document");
    } finally {
      setUploadLoading(false);
    }
    return false;
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        notes: values.notes,
        documentLink: values.pdfLink,
      };
      const response = await addDocumentNote(appointment.id, payload);
      message.success("Document and notes added successfully");
      form.resetFields();
      onSuccess(response);
    } catch (error) {
      console.error("Error adding document note:", error);
      message.error("Failed to save document and notes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={true}
      title="Add/View Documents & Notes"
      onCancel={onClose}
      footer={null}
      width={600}
      className="top-zero-m"
    >
      {/* Chat-like Display of Existing Documents */}
      <div
      className="docu-areay-c"

      >
        <Timeline>
          {appointment.documents.map((doc) => (
            <Timeline.Item key={doc.id}>
              <Space direction="vertical">
                <Text strong>{new Date(doc.createdAt).toLocaleString()}</Text>
                {renderFile(doc)}
                <Text type="primary" style={{ fontSize: "14px" }}>
                  {doc.notes}
                </Text>
              </Space>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>

      {/* Form to Add New Document */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: "20px" }}
      >
        <Form.Item
          name="notes"
          label="Notes"
          rules={[{ required: true, message: "Please add notes" }]}
        >
          <Input.TextArea rows={3} placeholder="Add any notes" />
        </Form.Item>

        <Form.Item
          name="pdfLink"
          label="Attach Document"
          rules={[{ required: true, message: "Please upload a document" }]}
        >
          <Input
            readOnly
            addonBefore={
              <Upload
                maxCount={1}
                showUploadList={false}
                beforeUpload={handleUpload}
                accept=".pdf,.jpg,.jpeg,.png,.mp4,.mov"
              >
                <Button
                  icon={
                    uploadLoading ? <LoadingOutlined /> : <UploadOutlined />
                  }
                  disabled={uploadLoading}
                >
                  {uploadLoading ? "Uploading..." : "Upload File"}
                </Button>
              </Upload>
            }
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDocumentsModal;
