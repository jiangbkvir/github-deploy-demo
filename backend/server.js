const express = require('express');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());

// CORS 支持
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// 请求日志中间件
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// 系统信息
function getSystemInfo() {
    return {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        cpus: os.cpus().length,
        totalMemory: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
        freeMemory: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
        uptime: `${Math.floor(os.uptime() / 60)} minutes`
    };
}

// ==================== API 端点 ====================

// 健康检查
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'backend',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 主 API 端点
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

// 统计数据 API
app.get('/api/stats', (req, res) => {
    res.json({
        success: true,
        data: {
            requests: {
                total: 1250,
                today: 89,
                successRate: '99.8%'
            },
            deployment: {
                lastDeploy: new Date().toISOString(),
                totalDeploys: 42,
                uptime: '15.5 days'
            },
            performance: {
                avgResponseTime: '45ms',
                p95ResponseTime: '120ms',
                errorRate: '0.02%'
            }
        }
    });
});

// 技术栈 API
app.get('/api/techstack', (req, res) => {
    res.json({
        success: true,
        data: {
            frontend: [
                { name: 'Vue 3', version: '3.5.13', icon: '🟢', description: '渐进式 JavaScript 框架' },
                { name: 'TypeScript', version: '5.7.2', icon: '🔷', description: '类型安全开发' },
                { name: 'Vite', version: '6.0.3', icon: '⚡', description: '下一代构建工具' },
                { name: 'Vue Router', version: '4.5.0', icon: '🛣️', description: '官方路由管理器' },
                { name: 'Pinia', version: '2.2.8', icon: '🍍', description: '状态管理库' }
            ],
            backend: [
                { name: 'Node.js', version: '18.x', icon: '💚', description: 'JavaScript 运行环境' },
                { name: 'Express', version: '4.x', icon: '🚂', description: 'Web 应用框架' }
            ],
            deployment: [
                { name: 'Docker', icon: '🐳', description: '容器化部署' },
                { name: 'Nginx', icon: '🦟', description: '反向代理' },
                { name: 'GitHub Actions', icon: '🔄', description: 'CI/CD 自动化' },
                { name: 'Cloudflare', icon: '☁️', description: '内网穿透' }
            ]
        }
    });
});

// 部署历史 API
app.get('/api/deployments', (req, res) => {
    const deployments = [
        { id: 1, version: '4.0.0', status: 'success', date: '2025-12-23', commit: 'e65a719', message: 'docs: add comprehensive comments' },
        { id: 2, version: '3.9.0', status: 'success', date: '2025-12-23', commit: '3756a33', message: 'feat: add Nginx for separation' },
        { id: 3, version: '3.8.0', status: 'success', date: '2025-12-23', commit: 'd828e64', message: 'docs: keep only Cloudflare Tunnel' },
        { id: 4, version: '3.7.0', status: 'success', date: '2025-12-23', commit: '440b309', message: 'feat: migrate to Vue 3 + TS' },
        { id: 5, version: '3.6.0', status: 'success', date: '2025-12-23', commit: '31189a1', message: 'feat: update to v3.0' }
    ];

    res.json({
        success: true,
        data: deployments,
        total: deployments.length
    });
});

// 系统信息 API
app.get('/api/system', (req, res) => {
    res.json({
        success: true,
        data: getSystemInfo()
    });
});

// 404 处理
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'API endpoint not found',
        path: req.path,
        method: req.method
    });
});

// 错误处理
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║           🚀 Backend Server Started!                       ║
╠══════════════════════════════════════════════════════════╣
║  Port:       ${PORT}
║  Environment: ${process.env.NODE_ENV || 'development'}                      ║
║  Node.js:    ${process.version}                               ║
║  Platform:   ${os.platform()} ${os.arch()}                           ║
╠══════════════════════════════════════════════════════════╣
║  API Endpoints:                                            ║
║    GET  /health       健康检查                             ║
║    GET  /api          主端点                               ║
║    GET  /api/stats    统计数据                             ║
║    GET  /api/techstack 技术栈                              ║
║    GET  /api/deployments 部署历史                          ║
║    GET  /api/system    系统信息                             ║
╚══════════════════════════════════════════════════════════╝
    `);
});
