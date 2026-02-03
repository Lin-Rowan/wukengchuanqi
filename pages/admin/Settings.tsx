import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message, Divider, Alert } from 'antd';
import { getSetting, updateSetting } from '../../services/api';

const Settings: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            // 这里我们手动获取几个已知的设置项
            // 实际项目中可能有更优雅的方式，比如获取所有设置的列表
            const heroData = await getSetting('hero_section').catch(() => null);

            if (heroData && heroData.value) {
                // heroData.value 是 JSON 字符串还是对象？根据后端 logic 应该是 jsonb -> object
                // updateSetting 发送 JSON stringify 的 value?
                // 后端 upsert value via body.value. upsert expects value to be jsonb if column is jsonb.
                // 我们之前在 settings API 里 upsert({ key, value })。
                // 如果数据库 value 是 jsonb，supabase 会自动处理。
                // 假设 value 是对象。
                form.setFieldsValue({
                    hero_title: heroData.value.title,
                    hero_subtitle: heroData.value.subtitle,
                    hero_image: heroData.value.image_url
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveHero = async (values: any) => {
        setLoading(true);
        try {
            const settingValue = {
                title: values.hero_title,
                subtitle: values.hero_subtitle,
                image_url: values.hero_image,
                updated_at: new Date().toISOString()
            };

            await updateSetting('hero_section', settingValue);
            message.success('保存成功');
        } catch (error) {
            message.error('保存失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 800 }}>
            <h2>系统设置</h2>
            <Alert message="提示：修改后可能需要刷新前台页面才能看到效果" type="info" showIcon style={{ marginBottom: 24 }} />

            <Card title="首页顶图配置 (Hero Section)">
                <Form form={form} layout="vertical" onFinish={handleSaveHero}>
                    <Form.Item name="hero_title" label="主标题" rules={[{ required: true }]}>
                        <Input placeholder="例如：无坑 传奇" />
                    </Form.Item>
                    <Form.Item name="hero_subtitle" label="副标题/标语" rules={[{ required: true }]}>
                        <Input placeholder="例如：做那个最靓的仔..." />
                    </Form.Item>
                    <Form.Item name="hero_image" label="背景图片URL" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            保存配置
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            <Divider />

            <Card title="其他配置">
                <p>更多配置项（如全局公告、SEO设置等）开发中...</p>
            </Card>
        </div>
    );
};

export default Settings;
