import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message, Popconfirm, Tag, Select } from 'antd';
import { DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { getAllComplaints, updateComplaintStatus, deleteComplaint, Complaint } from '../../services/api';

const ComplaintManager: React.FC = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const data = await getAllComplaints(filterStatus);
            setComplaints(data);
        } catch (error) {
            message.error('加载失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, [filterStatus]);

    const handleStatusChange = async (id: string, status: string) => {
        try {
            await updateComplaintStatus(id, status);
            message.success('状态更新成功');
            fetchComplaints();
        } catch (error) {
            message.error('更新失败');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteComplaint(id);
            message.success('删除成功');
            fetchComplaints();
        } catch (error) {
            message.error('删除失败');
        }
    };

    const columns = [
        {
            title: '提交时间',
            dataIndex: 'created_at',
            render: (text: string) => new Date(text).toLocaleString(),
            width: 180,
        },
        {
            title: '投诉内容',
            dataIndex: 'content',
            ellipsis: true,
        },
        {
            title: '联系方式',
            dataIndex: 'contact_info',
            width: 150,
        },
        {
            title: 'IP地址',
            dataIndex: 'ip_address',
            width: 130,
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 100,
            render: (status: string) => {
                const colors: any = { pending: 'orange', processed: 'green', ignored: 'red' };
                const texts: any = { pending: '待处理', processed: '已处理', ignored: '已忽略' };
                return <Tag color={colors[status]}>{texts[status]}</Tag>;
            }
        },
        {
            title: '操作',
            key: 'action',
            width: 200,
            render: (_: any, record: Complaint) => (
                <Space size="small">
                    {record.status === 'pending' && (
                        <>
                            <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleStatusChange(record.id, 'processed')}>处理</Button>
                            <Button type="link" size="small" danger icon={<CloseCircleOutlined />} onClick={() => handleStatusChange(record.id, 'ignored')}>忽略</Button>
                        </>
                    )}
                    <Popconfirm title="确定删除吗？" onConfirm={() => handleDelete(record.id)}>
                        <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <h2>投诉建议管理</h2>
                <Select
                    style={{ width: 120 }}
                    placeholder="筛选状态"
                    allowClear
                    onChange={setFilterStatus}
                    options={[
                        { label: '待处理', value: 'pending' },
                        { label: '已处理', value: 'processed' },
                        { label: '已忽略', value: 'ignored' },
                    ]}
                />
            </div>

            <Table
                columns={columns}
                dataSource={complaints}
                rowKey="id"
                loading={loading}
            />
        </div>
    );
};

export default ComplaintManager;
