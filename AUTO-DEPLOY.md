# 本地 Webhook 自动部署指南

## 工作原理

```
┌─────────────────┐     构建/测试      ┌─────────────────┐
│   GitHub 仓库   │ ─────────────────> │ GitHub Actions  │
└─────────────────┘                   └────────┬────────┘
                                               │
                                               │ 触发 Webhook
                                               ▼
┌─────────────────┐     内网穿透      ┌─────────────────┐
│   你的本地电脑   │ <──────────────── │ Cloudflare      │
│  (Webhook服务)  │                   │ Tunnel          │
└────────┬────────┘                   └─────────────────┘
         │
         │ 自动执行
         ▼
┌─────────────────┐
│ git pull +      │
│ docker-compose  │
│    up -d        │
└─────────────────┘
```

## 快速开始

### 步骤 1：安装 Cloudflare Tunnel

```bash
# macOS
brew install cloudflared

# 验证安装
cloudflared --version
```

### 步骤 2：启动 Webhook 服务

```bash
cd /Users/ananiu/Documents/docker/github-deploy-demo

# 方式一：直接运行
node webhook-server.js

# 方式二：使用启动脚本
./start-webhook.sh
```

你会看到：

```
╔══════════════════════════════════════════════════════════╗
║         🚀 Webhook Auto-Deploy Server Started!           ║
╠══════════════════════════════════════════════════════════╣
║  Webhook URL:  http://localhost:4000/webhook/deploy      ║
║  Health Check: http://localhost:4000/webhook/health      ║
╚══════════════════════════════════════════════════════════╝
```

### 步骤 3：启动 Cloudflare Tunnel

**新开一个终端窗口**，运行：

```bash
cloudflared tunnel --url http://localhost:4000
```

你会看到：

```
+--------------------------------------------------------------------------------------------+
|  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
|  https://advise-differences-active-identical.trycloudflare.com                             |
+--------------------------------------------------------------------------------------------+
```

### 步骤 4：配置 GitHub Secrets

访问：https://github.com/jiangbkvir/github-deploy-demo/settings/secrets/actions

添加两个 Secrets：

| Name | Value | 说明 |
|------|-------|------|
| `WEBHOOK_URL` | `advise-differences-active-identical.trycloudflare.com` | Cloudflare Tunnel 提供的公网地址 |
| `WEBHOOK_SECRET` | `my-secret-key` | 自定义密钥（可选） |

### 步骤 5：测试自动部署

1. 确保两个服务都在运行：
   - Webhook 服务（终端1）
   - Cloudflare Tunnel（终端2）

2. 修改代码并推送到 GitHub：

```bash
git add .
git commit -m "test: webhook auto deploy"
git push
```

3. 观察 Webhook 服务终端，你会看到自动部署日志：

```
📦 Webhook received: { action: 'deploy', commit: '...' }
⏳ Starting auto-deploy...
✅ Deploy successful!
```

## 常用命令

```bash
# 启动 webhook 服务
node webhook-server.js

# 启动 Cloudflare Tunnel
cloudflared tunnel --url http://localhost:4000

# 测试 webhook（本地测试）
curl -X POST http://localhost:4000/webhook/deploy \
  -H "Content-Type: application/json" \
  -d '{"action":"test"}'

# 检查 webhook 服务状态
curl http://localhost:4000/webhook/health
```

## 进阶：设置开机自启动

### macOS 使用 launchd

创建 `~/Library/LaunchAgents/com.github-deploy.webhook.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.github-deploy.webhook</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/Users/ananiu/Documents/docker/github-deploy-demo/webhook-server.js</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>WorkingDirectory</key>
    <string>/Users/ananiu/Documents/docker/github-deploy-demo</string>
</dict>
</plist>
```

加载服务：

```bash
launchctl load ~/Library/LaunchAgents/com.github-deploy.webhook.plist
```

### Cloudflare Tunnel 作为后台服务

创建 `~/Library/LaunchAgents/com.github-deploy.cloudflare.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.github-deploy.cloudflare</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/cloudflared</string>
        <string>tunnel</string>
        <string>--url</string>
        <string>http://localhost:4000</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
```

加载服务：

```bash
launchctl load ~/Library/LaunchAgents/com.github-deploy.cloudflare.plist
```

## 故障排除

**Q: Webhook 服务启动失败？**
```bash
# 检查端口是否被占用
lsof -i :4000

# 查看详细错误
node webhook-server.js
```

**Q: Cloudflare Tunnel 无法连接？**
- 检查网络连接
- 确认 webhook 服务正在运行
- 检查防火墙设置

**Q: 部署失败？**
- 检查 Git 配置：`git remote -v`
- 检查 Docker 状态：`docker ps`
- 查看 webhook 日志

## 安全提示

1. 使用强密钥作为 `WEBHOOK_SECRET`
2. 不要在公开仓库中暴露 Tunnel URL
3. 定期检查 GitHub Secrets 配置
4. 生产环境建议使用 Cloudflare Account Tunnel（固定域名）

## Cloudflare Tunnel 优势

| 特性 | 说明 |
|------|------|
| **免费使用** | 无需注册账号即可使用 quick tunnel |
| **稳定可靠** | Cloudflare 全球 CDN 网络 |
| **自动 HTTPS** | 所有连接自动加密 |
| **简单易用** | 一条命令即可启动 |
