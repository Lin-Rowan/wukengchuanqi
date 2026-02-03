import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Switch, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllCarouselSlides, createCarouselSlide, updateCarouselSlide, deleteCarouselSlide, CarouselSlide } from '../../services/api';

const CarouselManager: React.FC = () => {
    const [slides, setSlides] = useState<CarouselSlide[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form] = Form.useForm();

    const fetchSlides = async () => {
        try {
            setLoading(true);
            const data = await getAllCarouselSlides();
            setSlides(data);
        } catch (error) {
            message.error('获取轮播图失败');
            console.error('获取轮播图失败:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    // 当 Modal 打开且有 editingId 时，反填表单数据
    useEffect(() => {
        if (isModalOpen && editingId) {
            const slide = slides.find(s => s.id === editingId);
            if (slide) {
                form.setFieldsValue(slide);
            }
        } else if (isModalOpen && !editingId) {
            form.resetFields();
            form.setFieldsValue({
                is_active: true,
                sort_order: slides.length + 1
            });
        }
    }, [isModalOpen, editingId, slides]);

    const handleAdd = () => {
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleEdit = (slide: CarouselSlide) => {
        setEditingId(slide.id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            setLoading(true);
            await deleteCarouselSlide(id);
            message.success('删除成功');
            fetchSlides();
        } catch (error) {
            message.error('删除失败');
            console.error('删除轮播图失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log('表单验证通过，准备提交:', values);
            setLoading(true);
            
            const token = localStorage.getItem('admin_token');
            console.log('Token存在:', !!token);
            
            if (editingId) {
                console.log('执行更新操作');
                await updateCarouselSlide(editingId, values);
                message.success('更新成功');
            } else {
                console.log('执行创建操作');
                await createCarouselSlide(values);
                message.success('创建成功');
            }
            
            setIsModalOpen(false);
            fetchSlides();
        } catch (error: any) {
            console.error('保存轮播图失败:', error.message || error);
            message.error('操作失败: ' + (error.message || error));
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '徽标',
            dataIndex: 'badge',
            key: 'badge',
            render: (text: string) => <Tag color="red">{text}</Tag>,
        },
        {
            title: '排序',
            dataIndex: 'sort_order',
            key: 'sort_order',
        },
        {
            title: '状态',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'green' : 'gray'}>
                    {isActive ? '启用' : '禁用'}
                </Tag>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: CarouselSlide) => (
                <Space size="middle">
                    <Button 
                        icon={<EditOutlined />} 
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定删除吗？"
                        onConfirm={() => handleDelete(record.id)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button 
                            danger 
                            icon={<DeleteOutlined />}
                        >
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <h2>轮播图管理</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增轮播图</Button>
            </div>

            <Table
                columns={columns}
                dataSource={slides}
                rowKey="id"
                loading={loading}
                pagination={false}
            />

            <Modal
                title={editingId ? "编辑轮播图" : "新增轮播图"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                forceRender
                width={800}
            >
                <Form form={form} layout="vertical" preserve={false}>
                    <Form.Item name="title" label="标题" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="badge" label="徽标" rules={[{ required: true }]}>
                        <Input placeholder="例如：20严选总站" />
                    </Form.Item>
                    <Form.Item name="description" label="描述" rules={[{ required: true }]}>
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="refund_policy" label="退款政策" rules={[{ required: true }]}>
                        <Input placeholder="例如：包好玩，不好玩全额退款" />
                    </Form.Item>
                    <Form.Item name="image_url" label="图片链接" rules={[{ required: true }]}>
                        <Input placeholder="输入图片URL" />
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

export default CarouselManager;
