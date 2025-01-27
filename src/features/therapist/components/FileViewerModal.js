import React from 'react';
import { Modal, List, Button, message, Space } from 'antd';

const FileViewerModal = ({ appointment, onClose }) => {
    const handleDownload = (url, filename) => {
        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            })
            .catch(() => message.error('Failed to download file'));
    };

    return (
        <Modal
            title="Client Files"
            open={true}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            {appointment.client?.fileUpload && appointment.client?.fileUpload.length > 0 ? (
                <List
                    itemLayout="horizontal"
                    dataSource={appointment.client.fileUpload}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                title={item.filename}
                            />
                             <Space>
                                <Button
                                     type="primary"
                                     onClick={() => window.open(item.url, '_blank')}
                                >
                                 View
                              </Button>
                              <Button
                                   onClick={() => handleDownload(item.url, item.filename)}
                               >
                                 Download
                             </Button>
                            </Space>
                        </List.Item>
                    )}
                />
            ) : (
                <p>No files available for this client.</p>
            )}
        </Modal>
    );
};

export default FileViewerModal;