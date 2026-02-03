import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

/**
 * 获取所有激活的导航链接
 * GET /api/nav-links
 */
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('nav_links')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('获取导航链接失败:', error);
        res.status(500).json({ error: '获取导航链接失败' });
    }
});

/**
 * 获取所有导航链接（管理后台用）
 * GET /api/nav-links/all
 */
router.get('/all', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('nav_links')
            .select('*')
            .order('sort_order', { ascending: true });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('获取导航链接失败:', error);
        res.status(500).json({ error: '获取导航链接失败' });
    }
});

/**
 * 新增导航链接
 * POST /api/nav-links
 */
router.post('/', async (req, res) => {
    try {
        const { label, action_type, action_value, sort_order } = req.body;

        const { data, error } = await supabase
            .from('nav_links')
            .insert({
                label,
                action_type,
                action_value,
                sort_order: sort_order || 0
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        console.error('新增导航链接失败:', error);
        res.status(500).json({ error: '新增导航链接失败' });
    }
});

/**
 * 更新导航链接
 * PUT /api/nav-links/:id
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { label, action_type, action_value, sort_order, is_active } = req.body;

        const { data, error } = await supabase
            .from('nav_links')
            .update({
                label,
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
        console.error('更新导航链接失败:', error);
        res.status(500).json({ error: '更新导航链接失败' });
    }
});

/**
 * 删除导航链接
 * DELETE /api/nav-links/:id
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('nav_links')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(204).send();
    } catch (error) {
        console.error('删除导航链接失败:', error);
        res.status(500).json({ error: '删除导航链接失败' });
    }
});

export default router;
