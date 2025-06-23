// src/components/appointments/AppointmentDocumentsDisplay.js
import React from "react";
import { Card, List, Typography, Button, Space } from "antd"; // Import necessary components
import { FileTextOutlined, DownloadOutlined } from "@ant-design/icons"; // Import icons

const { Text } = Typography;

// --- Utility functions (copied from previous component) ---
const getFileType = (url) => {
  if (!url) return "unknown";
  const extension = url.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "image";
  if (["mp4", "mov", "webm", "ogg"].includes(extension)) return "video";
  if (extension === "pdf") return "pdf";
  return "unknown";
};

const renderFile = (doc) => {
  if (!doc || !doc.pdfLink) {
    return <Text type="secondary">No document attached</Text>;
  }

  const fileType = getFileType(doc.pdfLink);
  switch (fileType) {
    case "image":
      return (
        <img
          src={doc.pdfLink}
          alt="document"
          style={{
            maxWidth: "100%",
            maxHeight: "200px",
            objectFit: "contain",
            marginTop: "8px",
          }}
        />
      );
    case "video":
      return (
        <video
          controls
          style={{
            maxWidth: "100%",
            maxHeight: "200px",
            objectFit: "contain",
            marginTop: "8px",
          }}
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
          style={{ marginTop: "8px", paddingLeft: 0 }}
        >
          View/Download PDF
        </Button>
      );
    default:
      return (
        <Button
          type="link"
          href={doc.pdfLink}
          target="_blank"
          icon={<DownloadOutlined />}
          style={{ marginTop: "8px", paddingLeft: 0 }}
        >
          Download File ({doc.pdfLink.split(".").pop().toUpperCase()})
        </Button>
      );
  }
};
// --- End Utility functions ---

const AppointmentDocumentsDisplay = ({ documents }) => {
  // Don't render the card section if there are no documents
  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <Card
      type="inner"
      title={
        <div className="flex items-center gap-2">
          <FileTextOutlined />
          <span>Documents</span>
        </div>
      }
    >
      {/* Using Ant Design List for better structure */}
      <List
        itemLayout="vertical" // Use vertical layout for items
        dataSource={documents}
        renderItem={(doc) => (
          <List.Item
            key={doc.id}
            // You can add actions here if needed, but renderFile includes download
            // actions={[
            //   <Button type="link" href={doc.pdfLink} target="_blank" icon={<DownloadOutlined />}>Download</Button>
            // ]}
          >
            <List.Item.Meta
              description={
                <Text type="primary" >
                  Notes: {doc.notes || "No notes provided"}
                </Text>
              }
            />
            <div className="confirm0b-imgc">
              {renderFile(doc)}
              <Text className="txt-confirm-dt">{new Date(doc.createdAt).toLocaleString()}</Text>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default AppointmentDocumentsDisplay;
