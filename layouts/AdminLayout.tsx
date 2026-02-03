import React, { useState } from 'react';
import { Layout, Menu, Button, message, Avatar, Dropdown } from 'antd';
import {
    DashboardOutlined,
    PictureOutlined,
    TrophyOutlined,
    AppstoreOutlined,
    SettingOutlined,
    WechatOutlined,
    UserOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        message.success('已退出登录');
        navigate('/admin/login');
    };

    const userMenu = {
        items: [
            {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: '退出登录',
                onClick: handleLogout,
            },
        ],
    };

    const menuItems = [
        {
            key: '/admin/dashboard',
            icon: <DashboardOutlined />,
            label: '仪表盘',
        },
        {
            key: '/admin/carousel',
            icon: <PictureOutlined />,
            label: '轮播图管理',
        },
        {
            key: '/admin/cards',
            icon: <AppstoreOutlined />,
            label: '竖图卡片',
        },
        {
            key: '/admin/games',
            icon: <TrophyOutlined />,
            label: '游戏版本',
        },
        {
            key: '/admin/complaints',
            icon: <WechatOutlined />,
            label: '投诉建议',
        },
        {
            key: '/admin/settings',
            icon: <SettingOutlined />,
            label: '系统设置',
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark">
                <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                    {collapsed ? 'WK' : '无坑传奇后台'}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,21,41,.08)' }}>
                    <Dropdown menu={userMenu}>
                        <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                            管理员
                        </span>
                    </Dropdown>
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
