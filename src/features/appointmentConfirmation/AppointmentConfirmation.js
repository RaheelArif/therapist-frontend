import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Tag, Spin, message, Input, Button, Row, Col, Timeline, List, Typography } from 'antd';
import { getAppointmentById, createClientNote } from '../../api/appointment';
import dayjs from 'dayjs';
import { 
  ClockCircleOutlined, 
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  SendOutlined,
  DownloadOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

const AppointmentConfirmation = () => {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [note, setNote] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setPageLoading(true);
        const response = await getAppointmentById(appointmentId);
        setAppointment(response);
      } catch (error) {
        message.error('Failed to fetch appointment details');
      } finally {
        setPageLoading(false);
      }
    };

    if (appointmentId) {
      fetchAppointment();
    }
  }, [appointmentId]);

  const getStatusColor = (status) => {
    const colors = {
      SCHEDULED: 'blue',
      COMPLETED: 'green',
      CANCELED: 'red',
      RESCHEDULED: 'orange',
    };
    return colors[status] || 'default';
  };

  const handleAddNote = async () => {
    if (!note.trim()) {
      message.warning('Please enter a note');
      return;
    }
  
    try {
      setSubmitLoading(true);
      await createClientNote(appointmentId, { content: note });
      
      // Refresh appointment data to get updated notes
      const updatedAppointment = await getAppointmentById(appointmentId);
      setAppointment(updatedAppointment);
      
      message.success('Note added successfully');
      setNote('');
    } catch (error) {
      message.error('Failed to add note');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-500">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center p-4">
            <p>No appointment found</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card
        title={
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold">Appointment Details</span>
            <Tag color={getStatusColor(appointment.status)} className="text-base px-4 py-1">
              {appointment.status}
            </Tag>
          </div>
        }
        className="shadow-lg"
      >
        <Row gutter={[24, 24]}>
          {/* Client Info */}
          <Col span={24}>
            <Card type="inner" title={
              <div className="flex items-center gap-2">
                <UserOutlined />
                <span>Client Information</span>
              </div>
            }>
              <div className="flex items-center gap-3 mb-4">
                <UserOutlined className="text-xl text-blue-500" />
                <span className="text-lg">{appointment.client?.user?.fullname || 'N/A'}</span>
              </div>
            </Card>
          </Col>

          {/* Time and Date */}
          <Col span={24} md={12}>
            <Card type="inner" title={
              <div className="flex items-center gap-2">
                <CalendarOutlined />
                <span>Date & Time</span>
              </div>
            }>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CalendarOutlined className="text-blue-500" />
                  <span>{new Date(appointment.startTime).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <ClockCircleOutlined className="text-blue-500" />
                  <span>
                    {new Date(appointment.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} 
                    {' - '}
                    {new Date(appointment.endTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </Card>
          </Col>

          {/* Appointment Notes */}
          <Col span={24} md={12}>
            <Card type="inner" title={
              <div className="flex items-center gap-2">
                <FileTextOutlined />
                <span>Appointment Notes</span>
              </div>
            }>
              <div className="text-gray-600">
                {appointment.notes || 'No notes available'}
              </div>
            </Card>
          </Col>

          {/* Client Notes History */}
      

          {/* Documents */}
          {appointment.documents?.length > 0 && (
            <Col span={24}>
              <Card 
                type="inner" 
                title={
                  <div className="flex items-center gap-2">
                    <FileTextOutlined />
                    <span>Documents</span>
                  </div>
                }
              >
                <List
                  header={<Text strong>Previous Documents</Text>}
                  bordered
                  dataSource={appointment.documents}
                  renderItem={(doc) => (
                    <List.Item
                      actions={[
                        doc.pdfLink ? (
                          <Button
                            type="link"
                            href={doc.pdfLink}
                            target="_blank"
                            icon={<DownloadOutlined />}
                          >
                            Download
                          </Button>
                        ) : null,
                      ]}
                    >
                      <List.Item.Meta
                        title={`Notes: ${doc.notes || 'No notes provided'}`}
                        description={`Added on: ${new Date(doc.createdAt).toLocaleString()}`}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          )}

{appointment.clientNotes?.length > 0 && (
            <Col span={24}>
              <Card 
                type="inner" 
                title={
                  <div className="flex items-center gap-2">
                    <FileTextOutlined />
                    <span>Notes History</span>
                  </div>
                }
              >
                <Timeline
                  mode="left"
                  items={appointment.clientNotes.map((note) => ({
                    children: (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-gray-600 mb-2">
                          {note.content}
                        </div>
                        <div className="text-xs text-gray-400">
                          {dayjs(note.createdAt).format('MMM D, YYYY h:mm A')}
                        </div>
                      </div>
                    ),
                    color: 'blue',
                    label: dayjs(note.createdAt).format('h:mm A')
                  }))}
                />
              </Card>
            </Col>
          )}
          {/* Add Client Notes Section */}
          <Col span={24}>
            <Card 
              type="inner" 
              title={
                <div className="flex items-center gap-2">
                  <FileTextOutlined />
                  <span>Add Notes</span>
                </div>
              }
            >
              <TextArea
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add your notes here..."
                className="mb-4"
                disabled={submitLoading}
              />
              <Button 
                type="primary" 
                icon={<SendOutlined />}
                onClick={handleAddNote}
                className="float-right"
                loading={submitLoading}
              >
                Add Note
              </Button>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AppointmentConfirmation;
