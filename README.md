# GitHub 自动部署示例项目

这是一个完整的 GitHub 自动部署学习项目，包含前端页面和 Node.js 后端应用。

## 项目结构

```
github-deploy-demo/
├── frontend/
│   └── index.html          # 前端页面
├── backend/
│   ├── server.js           # Node.js 后端服务
│   ├── package.json        # 后端依赖配置
│   └── .dockerignore       # Docker 忽略文件
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions 工作流
├── Dockerfile              # Docker 镜像构建文件
├── docker-compose.yml      # Docker Compose 配置
└── README.md               # 项目文档
```

## 本地运行

### 方式一：使用 Docker Compose (推荐)

```bash
cd /Users/ananiu/Documents/docker/github-deploy-demo
docker-compose up -d
```

访问：http://localhost:3000

### 方式二：直接运行 Node.js

```bash
cd /Users/ananiu/Documents/docker/github-deploy-demo/backend
npm install
npm start
```

访问：http://localhost:3000

## GitHub 自动部署配置

### 步骤 1：创建 GitHub 仓库

```bash
cd /Users/ananiu/Documents/docker/github-deploy-demo
git init
git add .
git commit -m "Initial commit"
# 在 GitHub 上创建新仓库后执行：
git remote add origin https://github.com/你的用户名/github-deploy-demo.git
git branch -M main
git push -u origin main
```

### 步骤 2：配置 GitHub Secrets

在 GitHub 仓库中设置以下 Secrets (Settings → Secrets and variables → Actions):

#### 方式 A：SSH 部署方式

| Secret 名称 | 说明 | 示例值 |
|------------|------|-------|
| `SERVER_HOST` | 服务器 IP 或域名 | `123.45.67.89` |
| `SERVER_USER` | SSH 用户名 | `root` |
| `SSH_PRIVATE_KEY` | SSH 私钥 | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `SERVER_PORT` | SSH 端口 (可选) | `22` |

生成 SSH 密钥：
```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions
# 将公钥添加到服务器
ssh-copy-id -i ~/.ssh/github_actions.pub user@server
# 将私钥内容复制到 GitHub Secrets
cat ~/.ssh/github_actions
```

#### 方式 B：Webhook 部署方式 (更简单)

| Secret 名称 | 说明 |
|------------|------|
| `WEBHOOK_URL` | 你的 Webhook 接收地址 |

#### 方式 C：Docker Hub 推送 (可选)

| Secret 名称 | 说明 |
|------------|------|
| `DOCKER_USERNAME` | Docker Hub 用户名 |
| `DOCKER_PASSWORD` | Docker Hub 密码或访问令牌 |

### 步骤 3：配置服务器

在服务器上准备部署目录：

```bash
# 克隆代码
git clone https://github.com/你的用户名/github-deploy-demo.git /path/to/app
cd /path/to/app

# 启动服务
docker-compose up -d
```

### 步骤 4：部署流程

配置完成后，每次 `push` 到 `main` 分支时会自动触发部署：

```
代码推送到 GitHub
    ↓
GitHub Actions 检测到推送
    ↓
构建 Docker 镜像
    ↓
连接服务器 (SSH) 或触发 Webhook
    ↓
拉取最新代码
    ↓
重启 Docker 容器
    ↓
部署完成！
```

## 端点说明

| 端点 | 方法 | 说明 |
|------|------|------|
| `/` | GET | 前端页面 |
| `/api` | GET | API 接口 |
| `/health` | GET | 健康检查 |

## 学习要点

1. **Docker 镜像构建**：单 Dockerfile 同时包含前端和后端
2. **GitHub Actions 工作流**：自动化构建和部署流程
3. **多种部署方式**：SSH、Webhook、Docker Hub
4. **健康检查**：确保服务正常运行

## 扩展建议

- 添加数据库服务 (PostgreSQL/MySQL)
- 添加 Nginx 反向代理
- 配置 HTTPS 证书
- 添加环境变量管理
- 配置 CI/CD 测试流程

## 常见问题

**Q: GitHub Actions 失败怎么办？**
A: 检查 Secrets 是否正确配置，查看 Actions 日志获取详细错误信息。

**Q: 如何修改部署端口？**
A: 修改 `docker-compose.yml` 中的端口映射，如 `8080:3000`。

**Q: 本地测试和线上环境如何区分？**
A: 使用环境变量，在 `docker-compose.yml` 中配置不同的 `NODE_ENV`。
