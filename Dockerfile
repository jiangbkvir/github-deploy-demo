# 构建阶段 - 前端
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

# 运行阶段 - 后端
FROM node:18-alpine

WORKDIR /app

# 复制后端依赖文件
COPY backend/package*.json ./backend/

# 安装后端依赖
RUN cd backend && npm install --production

# 复制后端源代码
COPY backend/ ./backend/

# 从构建阶段复制前端构建产物
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist/

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production

# 启动应用
CMD ["node", "backend/server.js"]
