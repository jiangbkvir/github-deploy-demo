#!/bin/bash

# Webhook 自动部署启动脚本

echo "🚀 启动 Webhook 自动部署服务..."

# 检查是否安装了 express
if ! npm list express >/dev/null 2>&1; then
    echo "📦 安装依赖..."
    npm install express
fi

# 设置环境变量
export WEBHOOK_SECRET="${WEBHOOK_SECRET:-my-secret-key}"

# 启动 webhook 服务器
node webhook-server.js
