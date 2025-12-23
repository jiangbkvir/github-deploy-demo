const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// 健康检查端点
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API 端点
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: '🎉 欢迎使用 GitHub Actions 自动部署！代码已更新到 v3.0',
        timestamp: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
        environment: process.env.NODE_ENV || 'development',
        version: '3.0.0',
        author: 'jiangbkvir',
        features: ['Docker 容器化', 'GitHub Actions CI/CD', '前端 + Node.js 后端']
    });
});

// 处理前端路由
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API endpoint: http://localhost:${PORT}/api`);
});
