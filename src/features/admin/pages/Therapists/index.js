// pages/Therapists/index.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import TherapistForm from './components/TherapistForm';
import { getTherapists, createTherapist, deleteTherapist } from '../../../../api/therapist';

const TherapistsPage = () => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      setLoading(true);
      const data = await getTherapists();
      setTherapists(data);
    } catch (error) {
      message.error('Failed to fetch therapists');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTherapist = async (values) => {
    try {
      setLoading(true);
      await createTherapist(values);
      message.success('Therapist created successfully');
      setModalVisible(false);
      fetchTherapists();
    } catch (error) {
      message.error('Failed to create therapist');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    message.info('Edit functionality will be implemented');
  };

  const handleDelete = async (id) => {
    try {
      await deleteTherapist(id);
      message.success('Therapist deleted successfully');
      fetchTherapists();
    } catch (error) {
      message.error('Failed to delete therapist');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: ["user" , "fullname"],
      key: 'fullName',
    },
    {
      title: 'bio',
      dataIndex: 'bio',
      key: 'bio',
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
      render: (exp) => `${exp} years`,
    },

    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record.id)} />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Therapists Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Add New Therapist
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={therapists}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={loading}
      />

      <Modal
        title="Add New Therapist"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <TherapistForm onFinish={handleAddTherapist} loading={loading} />
      </Modal>
    </div>
  );
};

export default TherapistsPage;