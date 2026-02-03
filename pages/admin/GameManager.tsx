import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Switch, message, Popconfirm, Tag, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllGameVersions, createGameVersion, updateGameVersion, deleteGameVersion, GameVersion } from '../../services/api';

const GameManager: React.FC = () => {
    const [games, setGames] = useState<GameVersion[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form] = Form.useForm();

    const fetchGames = async () => {
        setLoading(true);
        try {
            const data = await getAllGameVersions();
            setGames(data);
        } catch (error) {
            message.error('加载失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    // 当 Modal 打开且有 editingId 时，反填表单数据
    useEffect(() => {
        if (isModalOpen && editingId) {
            const game = games.find(g => g.id === editingId);
            if (game) {
                form.setFieldsValue(game);
            }
        } else if (isModalOpen && !editingId) {
            form.resetFields();
            form.setFieldsValue({
                is_active: true,
                score: 80,
                sort_order: games.length + 1
            });
        }
    }, [isModalOpen, editingId, games]);

    const handleAdd = () => {
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record: GameVersion) => {
        setEditingId(record.id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteGameVersion(id);
            message.success('删除成功');
            fetchGames();
        } catch (error) {
            message.error('删除失败');
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingId) {
                await updateGameVersion(editingId, values);
                message.success('更新成功');
            } else {
                await createGameVersion(values);
                message.success('创建成功');
            }
            setIsModalOpen(false);
            fetchGames();
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
            title: '游戏名称',
            dataIndex: 'name',
            width: 200,
        },
        {
            title: '版本节奏',
            dataIndex: 'rhythm',
            ellipsis: true,
        },
        {
            title: '评分',
            dataIndex: 'score',
            render: (score: number) => <Tag color={score > 80 ? 'green' : 'orange'}>{score}</Tag>,
        },
        {
            title: '预约数',
            dataIndex: 'appointment_count',
            sorter: (a: any, b: any) => a.appointment_count - b.appointment_count,
        },
        {
            title: '状态',
            dataIndex: 'is_active',
            render: (active: boolean) => active ? <Tag color="green">启用</Tag> : <Tag color="red">禁用</Tag>,
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            render: (_: any, record: GameVersion) => (
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
                <h2>游戏版本管理</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增游戏</Button>
            </div>

            <Table
                columns={columns}
                dataSource={games}
                rowKey="id"
                loading={loading}
                pagination={false}
            />

            <Modal title={editingId ? "编辑游戏" : "新增游戏"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)} width={700} forceRender>
                <Form form={form} layout="vertical" preserve={false}>
                    <Form.Item name="name" label="游戏名称" rules={[{ required: true }]}>
                        <Input placeholder="例如：无坑传奇之【烈阳沉默】" />
                    </Form.Item>

                    <Space size="large" style={{ display: 'flex' }}>
                        <Form.Item name="score" label="推荐评分" style={{ width: 150 }}>
                            <InputNumber min={0} max={100} style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="sort_order" label="排序权重" style={{ width: 150 }}>
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="is_active" label="是否启用" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Space>

                    <Form.Item name="rhythm" label="版本节奏">
                        <Input placeholder="例如：三职业沉默复古版本，四个大陆" />
                    </Form.Item>
                    <Form.Item name="type" label="适合类型">
                        <Input placeholder="例如：1-5天持续有爽感，3-5天左右流畅通关" />
                    </Form.Item>
                    <Form.Item name="engine" label="引擎特性">
                        <Input.TextArea placeholder="例如：装备套数丰富，带BUFF元素..." rows={2} />
                    </Form.Item>

                    <Form.Item label="链接配置" style={{ marginBottom: 0 }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Form.Item name="launcher_url" label="登录器下载" style={{ margin: 0 }}>
                                <Input placeholder="URL" />
                            </Form.Item>
                            <Form.Item name="web_game_url" label="网页游戏链接" style={{ margin: '8px 0 0' }}>
                                <Input placeholder="URL" />
                            </Form.Item>
                            <Form.Item name="intro_url" label="版本介绍链接" style={{ margin: '8px 0 0' }}>
                                <Input placeholder="URL" />
                            </Form.Item>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default GameManager;
