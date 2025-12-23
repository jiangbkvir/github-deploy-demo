const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const WEBHOOK_PORT = 4000;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'my-secret-key';
const PROJECT_PATH = __dirname;

app.use(express.json());

// Webhook 接收端点
app.post('/webhook/deploy', (req, res) => {
    const signature = req.headers['x-webhook-secret'];

    // 验证密钥（可选的安全措施）
    if (signature && signature !== WEBHOOK_SECRET) {
        console.log('❌ Invalid webhook secret');
        return res.status(403).json({ error: 'Invalid secret' });
    }

    console.log('📦 Webhook received:', req.body);
    console.log('⏳ Starting auto-deploy...');

    // 执行部署命令
    const deployCommands = `
        cd "${PROJECT_PATH}"
        export https_proxy=http://127.0.0.1:6152
        export http_proxy=http://127.0.0.1:6152
        export all_proxy=socks5://127.0.0.1:6153
        git pull origin main
        docker-compose up -d --build
    `;

    exec(deployCommands, (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Deploy failed:', error);
            return res.status(500).json({
                success: false,
                error: error.message,
                stderr
            });
        }

        console.log('✅ Deploy successful!');
        console.log(stdout);
        res.json({
            success: true,
            message: 'Deployment triggered successfully',
            output: stdout
        });
    });
});

// 健康检查
app.get('/webhook/health', (req, res) => {
    res.json({ status: 'ok', service: 'webhook-listener' });
});

app.listen(WEBHOOK_PORT, '0.0.0.0', () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║         🚀 Webhook Auto-Deploy Server Started!           ║
╠══════════════════════════════════════════════════════════╣
║  Webhook URL:  http://localhost:${WEBHOOK_PORT}/webhook/deploy         ║
║  Health Check: http://localhost:${WEBHOOK_PORT}/webhook/health        ║
║  Project Path: ${PROJECT_PATH}    ║
╠══════════════════════════════════════════════════════════╣
║  等待 GitHub Actions 触发...                              ║
╚══════════════════════════════════════════════════════════╝
    `);
});
