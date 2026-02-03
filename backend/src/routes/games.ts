import { Router, Request } from 'express';
import { supabase } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

/**
 * 获取客户端IP地址
 */
function getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
        return forwarded.split(',')[0].trim();
    }
    return req.socket.remoteAddress || 'unknown';
}

/**
 * 获取所有激活的游戏版本
 * GET /api/games
 */
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('game_versions')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('获取游戏列表失败:', error);
        res.status(500).json({ error: '获取游戏列表失败' });
    }
});

/**
 * 获取所有游戏版本（管理后台用）
 * GET /api/games/all
 */
router.get('/all', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('game_versions')
            .select('*')
            .order('sort_order', { ascending: true });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('获取游戏列表失败:', error);
        res.status(500).json({ error: '获取游戏列表失败' });
    }
});

// ... (GET接口保持不变)

/**
 * 新增游戏版本
 * POST /api/games
 */
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, rhythm, type, engine, description, score, launcher_url, web_game_url, intro_url, sort_order } = req.body;

        const { data, error } = await supabase
            .from('game_versions')
            .insert({
                name,
                rhythm,
                type,
                engine,
                description,
                score: score || 0,
                appointment_count: 0,
                launcher_url,
                web_game_url,
                intro_url,
                sort_order: sort_order || 0
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        console.error('新增游戏失败:', error);
        res.status(500).json({ error: '新增游戏失败' });
    }
});

/**
 * 更新游戏版本
 * PUT /api/games/:id
 */
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, rhythm, type, engine, description, score, launcher_url, web_game_url, intro_url, sort_order, is_active } = req.body;

        const { data, error } = await supabase
            .from('game_versions')
            .update({
                name,
                rhythm,
                type,
                engine,
                description,
                score,
                launcher_url,
                web_game_url,
                intro_url,
                sort_order,
                is_active
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('更新游戏失败:', error);
        res.status(500).json({ error: '更新游戏失败' });
    }
});

/**
 * 删除游戏版本
 * DELETE /api/games/:id
 */
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('game_versions')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(204).send();
    } catch (error) {
        console.error('删除游戏失败:', error);
        res.status(500).json({ error: '删除游戏失败' });
    }
});

/**
 * 预约游戏（每IP每天一次）
 * POST /api/games/:id/appoint
 */
router.post('/:id/appoint', async (req, res) => {
    try {
        const { id } = req.params;
        const clientIp = getClientIp(req);
        const today = new Date().toISOString().split('T')[0];

        // 检查今日是否已预约
        const { data: existing } = await supabase
            .from('appointments')
            .select('id')
            .eq('game_id', id)
            .eq('ip_address', clientIp)
            .eq('created_at', today)
            .single();

        if (existing) {
            return res.status(400).json({ error: '今日已预约，每个IP每天只能预约一次' });
        }

        // 新增预约记录
        const { error: insertError } = await supabase
            .from('appointments')
            .insert({
                game_id: id,
                ip_address: clientIp,
                created_at: today
            });

        if (insertError) throw insertError;

        // 更新游戏预约计数
        const { data: game } = await supabase
            .from('game_versions')
            .select('appointment_count')
            .eq('id', id)
            .single();

        const newCount = (game?.appointment_count || 0) + 1;

        await supabase
            .from('game_versions')
            .update({ appointment_count: newCount })
            .eq('id', id);

        res.json({ success: true, appointment_count: newCount });
    } catch (error) {
        console.error('预约失败:', error);
        res.status(500).json({ error: '预约失败' });
    }
});

export default router;
