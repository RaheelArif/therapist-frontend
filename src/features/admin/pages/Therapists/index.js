import { Table, Button, Space, Tag, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const TherapistsPage = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
      render: (exp) => `${exp} years`,
    },
    {
      title: 'Bio',
      dataIndex: 'bio',
      key: 'bio',
      ellipsis: true,
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

  const handleEdit = (id) => {
    // Handle edit
  };

  const handleDelete = (id) => {
    // Handle delete
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary">Add New Therapist</Button>
      </div>
      <Table 
        columns={columns} 
        // dataSource={therapists}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default TherapistsPage;