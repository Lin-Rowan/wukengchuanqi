import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Switch, message, Popconfirm, Tag, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllActionCards, createActionCard, updateActionCard, deleteActionCard, ActionCard } from '../../services/api';

const CardManager: React.FC = () => {
    const [cards, setCards] = useState<ActionCard[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form] = Form.useForm();

    const fetchCards = async () => {
        setLoading(true);
        try {
            const data = await getAllActionCards();
            setCards(data);
        } catch (error) {
            message.error('加载失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    // 当 Modal 打开且有 editingId 时，反填表单数据
    useEffect(() => {
        if (isModalOpen && editingId) {
            const card = cards.find(c => c.id === editingId);
            if (card) {
                form.setFieldsValue(card);
            }
        } else if (isModalOpen && !editingId) {
            form.resetFields();
            form.setFieldsValue({
                is_active: true,
                sort_order: cards.length + 1
            });
        }
    }, [isModalOpen, editingId, cards]);

    const handleAdd = () => {
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record: ActionCard) => {
        setEditingId(record.id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteActionCard(id);
            message.success('删除成功');
            fetchCards();
        } catch (error) {
            message.error('删除失败');
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingId) {
                await updateActionCard(editingId, values);
                message.success('更新成功');
            } else {
                await createActionCard(values);
                message.success('创建成功');
            }
            setIsModalOpen(false);
            fetchCards();
        } catch (error) {
            // error is handled by form or api
        }
    };

    const columns = [
        {
            title: '排序',
            dataIndex: 'sort_order',
            width: 80,
            sorter: (a: any, b: any) => a.sort_order - b.sort_order,
        },
        {
            title: '预览',
            dataIndex: 'image_url',
            render: (url: string) => <img src={url} alt="preview" style={{ width: 60, height: 100, objectFit: 'cover', borderRadius: 4 }} />,
        },
        {
            title: '标题',
            dataIndex: 'title',
        },
        {
            title: '动作类型',
            dataIndex: 'action_type',
            render: (type: string) => {
                const map: any = { 'qq_friend': '加QQ好友', 'qq_group': '加QQ群', 'link': '外链', 'page': '页面跳转' };
                return <Tag color="blue">{map[type] || type}</Tag>;
            }
        },
        {
            title: '动作值',
            dataIndex: 'action_value',
            ellipsis: true,
        },
        {
            title: '状态',
            dataIndex: 'is_active',
            render: (active: boolean) => active ? <Tag color="green">启用</Tag> : <Tag color="red">禁用</Tag>,
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: ActionCard) => (
                <Space size="middle">
                    <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
                    <Popconfirm title="确定删除吗？" onConfirm={() => handleDelete(record.id)}>
                        <Button type="text" danger icon={<DeleteOutlined />}>删除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <h2>竖图卡片管理</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增卡片</Button>
            </div>

            <Table
                columns={columns}
                dataSource={cards}
                rowKey="id"
                loading={loading}
                pagination={false}
            />

            <Modal title={editingId ? "编辑卡片" : "新增卡片"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)} forceRender>
                <Form form={form} layout="vertical" preserve={false}>
                    <Form.Item name="title" label="标题" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="image_url" label="图片链接" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="action_type" label="点击动作" rules={[{ required: true }]}>
                        <Select options={[
                            { label: '添加QQ好友', value: 'qq_friend' },
                            { label: '加入QQ群', value: 'qq_group' },
                            { label: '打开外部链接', value: 'link' },
                            { label: '应用内跳转', value: 'page' },
                        ]} />
                    </Form.Item>
                    <Form.Item name="action_value" label="动作参数" rules={[{ required: true }]} help="QQ号、群Key、URL或页面路径">
                        <Input />
                    </Form.Item>
                    <Form.Item name="sort_order" label="排序权重">
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="is_active" label="是否启用" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CardManager;
