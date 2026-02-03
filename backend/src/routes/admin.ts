import { Router } from 'express';
import { supabase } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

/**
 * 获取仪表盘统计数据
 * GET /api/admin/dashboard-stats
 */
router.get('/dashboard-stats', authenticateToken, async (req, res) => {
    try {
        // 1. 今日访问量 (暂用Appointments模拟，实际应有专门的日志表)
        // 这里暂时返回固定值或简单计数，后续可对接真实统计
        const today = new Date().toISOString().split('T')[0];

        // 2. 累计预约
        const { count: appointmentCount } = await supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true });

        // 3. 在线游戏版本
        const { count: gameCount } = await supabase
            .from('game_versions')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true);

        // 4. 待处理投诉
        const { count: pendingComplaints } = await supabase
            .from('complaints')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');

        res.json({
            todayVisits: 1234, // 每次可+1或从redis取
            totalAppointments: appointmentCount || 0,
            activeGames: gameCount || 0,
            pendingComplaints: pendingComplaints || 0
        });
    } catch (error) {
        console.error('获取仪表盘数据失败:', error);
        res.status(500).json({ error: '获取数据失败' });
    }
});

export default router;
