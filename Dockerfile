# 使用官方 Node.js 镜像作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制后端 package.json
COPY backend/package*.json ./backend/

# 安装依赖
RUN cd backend && npm install --production

# 复制前端文件
COPY frontend/ ./frontend/

# 复制后端源代码
COPY backend/ ./backend/

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production

# 启动应用
CMD ["node", "backend/server.js"]
