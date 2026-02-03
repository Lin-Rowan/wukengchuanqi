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
 * 提交投诉建议
 * POST /api/complaints
 */
router.post('/', async (req, res) => {
    try {
        const { content, contact_info } = req.body;
        const clientIp = getClientIp(req);

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: '投诉内容不能为空' });
        }

        const { data, error } = await supabase
            .from('complaints')
            .insert({
                content: content.trim(),
                contact_info: contact_info || null,
                ip_address: clientIp,
                status: 'pending'
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ success: true, id: data.id });
    } catch (error) {
        console.error('提交投诉失败:', error);
        res.status(500).json({ error: '提交投诉失败' });
    }
});

// ... POST (public) ...

/**
 * 获取所有投诉（管理后台用）
 * GET /api/complaints
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { status } = req.query;

        let query = supabase
            .from('complaints')
            .select('*')
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('获取投诉列表失败:', error);
        res.status(500).json({ error: '获取投诉列表失败' });
    }
});

/**
 * 更新投诉状态
 * PUT /api/complaints/:id
 */
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const { data, error } = await supabase
            .from('complaints')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('更新投诉状态失败:', error);
        res.status(500).json({ error: '更新投诉状态失败' });
    }
});

/**
 * 删除投诉
 * DELETE /api/complaints/:id
 */
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('complaints')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(204).send();
    } catch (error) {
        console.error('删除投诉失败:', error);
        res.status(500).json({ error: '删除投诉失败' });
    }
});

export default router;
