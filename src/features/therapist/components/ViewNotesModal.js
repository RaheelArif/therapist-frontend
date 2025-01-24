import React from 'react';
import { Modal, List, Typography, Divider } from 'antd';
import dayjs from 'dayjs'; // Import dayjs for date formatting
import 'dayjs/locale/en-gb';

const { Text } = Typography;

const ViewNotesModal = ({ appointment, onClose }) => {
  dayjs.locale('en-gb');

  return (
    <Modal
      title="Client Notes"
      open={true}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      {appointment?.clientNotes && appointment?.clientNotes.length > 0 ? (
        <List
          dataSource={appointment.clientNotes}
          renderItem={(item) => (
            <List.Item style={{ border: '1px solid #e8e8e8', marginBottom: '10px', padding: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection:"column" }}>
                <Text>{item.content}</Text>
               
                <Text style={{ display: 'flex', justifyContent: 'flex-end'  , width:'100%' }} type="secondary">
                  {dayjs(item.createdAt).format('DD MMM YYYY, HH:mm:ss')}
                </Text>
              </div>
              
            </List.Item>
          )}
        />
      ) : (
        <p>No notes available.</p>
      )}
    </Modal>
  );
};

export default ViewNotesModal;