const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());

// CORS 支持（可选，如果前后端分离部署）
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// 健康检查端点
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'backend', timestamp: new Date().toISOString() });
});

// API 端点
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: '🎉 欢迎使用 GitHub Actions 自动部署！前后端分离版本',
        timestamp: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
        environment: process.env.NODE_ENV || 'development',
        version: '4.0.0',
        author: 'jiangbkvir',
        architecture: 'Frontend (Nginx) + Backend (Node.js)',
        features: ['Vue 3', 'TypeScript', 'Vue Router', 'Pinia', 'Vite', 'Nginx', 'Docker', 'GitHub Actions CI/CD']
    });
});

// 404 处理
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'API endpoint not found' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API endpoint: http://localhost:${PORT}/api`);
});
