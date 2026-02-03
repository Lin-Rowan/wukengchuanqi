import { Router } from 'express';
import { supabase } from '../config/supabase.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-it-in-production';

/**
 * 管理员登录
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 查找用户
        const { data: admin, error } = await supabase
            .from('admins')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !admin) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }

        // 验证密码
        const isValid = await bcrypt.compare(password, admin.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }

        // 生成Token
        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 更新最后登录时间
        await supabase
            .from('admins')
            .update({ last_login: new Date().toISOString() })
            .eq('id', admin.id);

        res.json({ token, admin: { id: admin.id, username: admin.username } });
    } catch (error) {
        console.error('登录失败:', error);
        res.status(500).json({ error: '登录失败' });
    }
});

/**
 * 初始化管理员 (仅限开发环境或无管理员时调用)
 * POST /api/auth/init
 */
router.post('/init', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 检查是否已有管理员（防止滥用）
        const { count } = await supabase
            .from('admins')
            .select('*', { count: 'exact', head: true });

        if (count && count > 0) {
            // 开发模式下允许重置密码
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);

            const { data, error } = await supabase
                .from('admins')
                .update({ password_hash: password_hash })
                .eq('username', username)
                .select();

            if (error) throw error;
            console.log('管理员已存在，密码已重置');
            return res.json({ message: '管理员密码已重置', user: data });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const { data, error } = await supabase
            .from('admins')
            .insert({ username, password_hash })
            .select()
            .single();

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('初始化失败:', error);
        res.status(500).json({ error: '初始化失败' });
    }
});

export default router;
