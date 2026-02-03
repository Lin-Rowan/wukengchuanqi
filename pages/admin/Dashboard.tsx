import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { UserOutlined, AppstoreOutlined, WechatOutlined, TrophyOutlined } from '@ant-design/icons';

const Dashboard: React.FC = () => {
    return (
        <div>
            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="今日访问"
                            value={1128}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="累计预约"
                            value={88888}
                            prefix={<TrophyOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="在线游戏"
                            value={3}
                            prefix={<AppstoreOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="待处理投诉"
                            value={5}
                            prefix={<WechatOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="欢迎回来" style={{ marginTop: 24, minHeight: 400 }}>
                <p>欢迎使用无坑传奇后台管理系统。请从左侧菜单选择功能进行操作。</p>
            </Card>
        </div>
    );
};

export default Dashboard;
