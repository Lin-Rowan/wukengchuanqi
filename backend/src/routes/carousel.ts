import { Router } from 'express';
import { supabase } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

/**
 * 获取所有激活的轮播图
 * GET /api/carousel
 */
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('carousel_slides')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('获取轮播图失败:', error);
        res.status(500).json({ error: '获取轮播图失败' });
    }
});

/**
 * 获取所有轮播图（管理后台用）
 * GET /api/carousel/all
 */
router.get('/all', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('carousel_slides')
            .select('*')
            .order('sort_order', { ascending: true });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('获取轮播图失败:', error);
        res.status(500).json({ error: '获取轮播图失败' });
    }
});

// ... (GET接口保持不变)

/**
 * 新增轮播图
 * POST /api/carousel
 */
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, badge, description, refund_policy, image_url, sort_order, is_active } = req.body;

        const { data, error } = await supabase
            .from('carousel_slides')
            .insert({
                title,
                badge,
                description,
                refund_policy,
                image_url,
                sort_order: sort_order || 0,
                is_active: is_active !== undefined ? is_active : true
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        console.error('新增轮播图失败:', error);
        res.status(500).json({ error: '新增轮播图失败' });
    }
});

/**
 * 更新轮播图
 * PUT /api/carousel/:id
 */
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, badge, description, refund_policy, image_url, sort_order, is_active } = req.body;

        const { data, error } = await supabase
            .from('carousel_slides')
            .update({
                title,
                badge,
                description,
                refund_policy,
                image_url,
                sort_order,
                is_active
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('更新轮播图失败:', error);
        res.status(500).json({ error: '更新轮播图失败' });
    }
});

/**
 * 删除轮播图
 * DELETE /api/carousel/:id
 */
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('carousel_slides')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(204).send();
    } catch (error) {
        console.error('删除轮播图失败:', error);
        res.status(500).json({ error: '删除轮播图失败' });
    }
});

export default router;
