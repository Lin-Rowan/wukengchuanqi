import { Router } from 'express';
import { supabase } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

/**
 * 获取指定设置项
 * GET /api/settings/:key
 */
router.get('/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .eq('key', key)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ error: '设置项不存在' });
            }
            throw error;
        }

        res.json(data);
    } catch (error) {
        console.error('获取设置失败:', error);
        res.status(500).json({ error: '获取设置失败' });
    }
});

// ... (GET接口保持不变)

/**
 * 更新设置项
 * PUT /api/settings/:key
 */
router.put('/:key', authenticateToken, async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;

        const { data, error } = await supabase
            .from('site_settings')
            .upsert({ key, value, updated_at: new Date().toISOString() })
            .select()
            .single();

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('更新设置失败:', error);
        res.status(500).json({ error: '更新设置失败' });
    }
});

export default router;
