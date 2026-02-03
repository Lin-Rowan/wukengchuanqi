import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import settingsRouter from './routes/settings.js';
import carouselRouter from './routes/carousel.js';
import cardsRouter from './routes/cards.js';
import gamesRouter from './routes/games.js';
import complaintsRouter from './routes/complaints.js';
import navLinksRouter from './routes/navLinks.js';
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件配置
app.use(cors({
    origin: '*', // 临时允许所有来源进行调试
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// 根路由
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: '无坑传奇 API 服务', version: '1.0.0' });
});

// 详细请求日志
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    /* 避免日志过多，仅调试Auth时开启Header日志
    if (req.url.startsWith('/api/auth') || req.url.startsWith('/api/admin')) {
        console.log('Headers:', req.headers);
    } 
    */
    next();
});

// 路由注册
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/carousel', carouselRouter);
app.use('/api/cards', cardsRouter);
app.use('/api/games', gamesRouter);
app.use('/api/complaints', complaintsRouter);
app.use('/api/nav-links', navLinksRouter);

// 健康检查接口
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 错误处理中间件
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('服务器错误:', err);
    res.status(500).json({ error: '服务器内部错误' });
});

app.listen(PORT, () => {
    console.log(`🚀 后端服务已启动: http://localhost:${PORT}`);
});
