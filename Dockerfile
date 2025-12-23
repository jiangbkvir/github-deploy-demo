# ================================
# 阶段 1: 构建前端
# ================================
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# 复制前端依赖文件
COPY frontend-vue/package*.json ./

# 安装前端依赖
RUN npm install

# 复制前端源代码
COPY frontend-vue/ ./

# 构建前端
RUN npm run build

# ================================
# 阶段 2: 构建后端
# ================================
FROM node:18-alpine AS backend-builder

WORKDIR /app

# 复制后端依赖文件
COPY backend/package*.json ./

# 安装后端依赖
RUN npm install --production

# 复制后端源代码
COPY backend/ ./

# ================================
# 阶段 3: 前端 Nginx 镜像
# ================================
FROM nginx:alpine AS frontend

# 从构建阶段复制前端构建产物
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# ================================
# 阶段 4: 后端运行镜像
# ================================
FROM node:18-alpine AS backend

WORKDIR /app

# 从后端构建阶段复制依赖和代码
COPY --from=backend-builder /app /app

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production

# 启动应用
CMD ["node", "server.js"]
