import { Router } from 'express';
import { supabase } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

/**
 * 获取所有激活的竖图卡片
 * GET /api/cards
 */
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('action_cards')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('获取卡片失败:', error);
        res.status(500).json({ error: '获取卡片失败' });
    }
});

/**
 * 获取所有卡片（管理后台用）
 * GET /api/cards/all
 */
router.get('/all', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('action_cards')
            .select('*')
            .order('sort_order', { ascending: true });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('获取卡片失败:', error);
        res.status(500).json({ error: '获取卡片失败' });
    }
});

// ... (GET接口保持不变)

/**
 * 新增卡片
 * POST /api/cards
 */
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, image_url, action_type, action_value, sort_order } = req.body;

        const { data, error } = await supabase
            .from('action_cards')
            .insert({
                title,
                image_url,
                action_type,
                action_value,
                sort_order: sort_order || 0
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        console.error('新增卡片失败:', error);
        res.status(500).json({ error: '新增卡片失败' });
    }
});

/**
 * 更新卡片
 * PUT /api/cards/:id
 */
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, image_url, action_type, action_value, sort_order, is_active } = req.body;

        const { data, error } = await supabase
            .from('action_cards')
            .update({
                title,
                image_url,
                action_type,
                action_value,
                sort_order,
                is_active
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('更新卡片失败:', error);
        res.status(500).json({ error: '更新卡片失败' });
    }
});

/**
 * 删除卡片
 * DELETE /api/cards/:id
 */
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('action_cards')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(204).send();
    } catch (error) {
        console.error('删除卡片失败:', error);
        res.status(500).json({ error: '删除卡片失败' });
    }
});

export default router;
