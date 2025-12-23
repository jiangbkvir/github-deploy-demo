const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 检测是否为生产环境（Vue 构建产物）
const isProduction = process.env.NODE_ENV === 'production';
const staticPath = isProduction
    ? path.join(__dirname, '../frontend/dist')
    : path.join(__dirname, '../frontend-vue'); // 开发环境服务源码

// 中间件
app.use(express.json());
app.use(express.static(staticPath));

// 健康检查端点
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API 端点
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: '🎉 欢迎使用 GitHub Actions 自动部署！Vue 3 + TypeScript 版本',
        timestamp: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
        environment: process.env.NODE_ENV || 'development',
        version: '3.0.0',
        author: 'jiangbkvir',
        features: ['Vue 3', 'TypeScript', 'Vue Router', 'Pinia', 'Vite', 'Docker 容器化', 'GitHub Actions CI/CD']
    });
});

// 处理前端路由（SPA）
app.get('*', (req, res) => {
    const indexPath = isProduction
        ? path.join(__dirname, '../frontend/dist/index.html')
        : path.join(__dirname, '../frontend-vue/index.html');
    res.sendFile(indexPath);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Static files: ${staticPath}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API endpoint: http://localhost:${PORT}/api`);
});
