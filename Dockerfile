# ========================================
# 多阶段构建 Dockerfile
# 用途: 前后端分离部署，分别构建前端和后端镜像
# 架构: Vue 3 (Nginx) + Node.js (Express)
# ========================================

# ========================================
# 阶段 1: 构建前端 (Vue 3)
# ========================================
FROM node:18-alpine AS frontend-builder

# 设置工作目录
WORKDIR /app/frontend

# 步骤 1: 复制 package.json（利用 Docker 缓存层）
COPY frontend-vue/package*.json ./

# 步骤 2: 安装前端依赖
# npm ci 比 npm install 更快更可靠，适合 CI/CD
RUN npm install

# 步骤 3: 复制前端源代码
COPY frontend-vue/ ./

# 步骤 4: 构建前端生产版本
# 输出目录: dist/
RUN npm run build

# ========================================
# 阶段 2: 构建后端 (Node.js + Express)
# ========================================
FROM node:18-alpine AS backend-builder

# 设置工作目录
WORKDIR /app

# 步骤 1: 复制 package.json
COPY backend/package*.json ./

# 步骤 2: 仅安装生产依赖（--production 跳过 devDependencies）
RUN npm install --production

# 步骤 3: 复制后端源代码
COPY backend/ ./

# ========================================
# 阶段 3: 前端运行镜像 (Nginx)
# ========================================
FROM nginx:alpine AS frontend

# 说明: 使用轻量级 Nginx Alpine 镜像
# 优势: 镜像小 (~40MB)、性能高、适合生产环境

# 从构建阶段复制前端构建产物到 Nginx 静态文件目录
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# 复制自定义 Nginx 配置
# - 反向代理 /api 到后端
# - SPA 路由支持 (try_files)
# - Gzip 压缩
# - 静态资源缓存
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# 暴露 HTTP 端口
EXPOSE 80

# Nginx 镜像已内置启动命令，无需额外 CMD

# ========================================
# 阶段 4: 后端运行镜像 (Node.js)
# ========================================
FROM node:18-alpine AS backend

# 设置工作目录
WORKDIR /app

# 从后端构建阶段复制完整的应用目录
# 包含: node_modules/, server.js, package.json
COPY --from=backend-builder /app /app

# 暴露应用端口
EXPOSE 3000

# 设置生产环境变量
ENV NODE_ENV=production

# 健康检查（可选，Docker Swarm/Kubernetes 使用）
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 启动 Node.js 应用
CMD ["node", "server.js"]

# ========================================
# 构建命令说明
# ========================================
#
# 构建前端镜像:
#   docker build --target frontend -t my-app:frontend .
#
# 构建后端镜像:
#   docker build --target backend -t my-app:backend .
#
# 使用 docker-compose 同时构建:
#   docker-compose build
#
# ========================================
