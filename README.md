# GitHub Actions 自动部署示例

完整的 GitHub Actions 自动部署学习项目，使用 **Vue 3 + TypeScript + Node.js + Docker** 构建。

## 技术栈

### 前端
| 技术 | 版本 | 说明 |
|------|------|------|
| **Vue 3** | 3.5.13 | 渐进式 JavaScript 框架 |
| **TypeScript** | 5.7.2 | 类型安全开发 |
| **Vite** | 6.0.3 | 下一代前端构建工具 |
| **Vue Router** | 4.5.0 | Vue.js 官方路由管理器 |
| **Pinia** | 2.2.8 | Vue 官方状态管理库 |

### 后端
| 技术 | 说明 |
|------|------|
| **Node.js** | JavaScript 运行环境 |
| **Express** | 简洁灵活的 Web 框架 |

### 部署 & CI/CD
| 技术 | 说明 |
|------|------|
| **Docker** | 容器化部署 |
| **GitHub Actions** | 持续集成与部署 |
| **Cloudflare Tunnel** | 内网穿透（本地部署） |
| **Webhook** | 自动部署触发 |

## 项目结构

```
github-deploy-demo/
├── frontend-vue/              # Vue 3 前端工程
│   ├── src/
│   │   ├── views/            # 页面组件
│   │   │   ├── Home.vue      # 首页
│   │   │   └── About.vue     # 关于页
│   │   ├── stores/           # Pinia 状态管理
│   │   │   └── app.ts        # 应用状态
│   │   ├── router/           # Vue Router 路由
│   │   │   └── index.ts      # 路由配置
│   │   ├── components/       # 可复用组件
│   │   ├── App.vue           # 根组件
│   │   └── main.ts           # 应用入口
│   ├── package.json
│   ├── vite.config.ts        # Vite 配置
│   └── tsconfig.json         # TypeScript 配置
├── backend/                   # Node.js 后端
│   ├── server.js             # Express 服务器
│   ├── package.json          # 后端依赖
│   └── .dockerignore
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions 工作流
├── webhook-server.js         # Webhook 监听服务
├── Dockerfile                # 多阶段构建配置
├── docker-compose.yml        # 本地运行配置
└── README.md
```

## 自动部署流程

```
┌─────────────────┐
│   推送代码到    │
│  GitHub 仓库    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  GitHub Actions │
│  构建 Docker    │
│     镜像测试    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Cloudflare      │
│ Tunnel (Webhook)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   本地自动执行  │
│  git pull +     │
│ docker rebuild  │
└────────┬────────┘
         │
         ▼
    🎉 部署成功！
```

## 快速开始

### 方式一：Docker Compose（推荐）

```bash
# 克隆项目
git clone https://github.com/jiangbkvir/github-deploy-demo.git
cd github-deploy-demo

# 构建并启动
docker-compose up -d --build
```

访问：http://localhost:3000

### 方式二：开发模式（前端）

```bash
# 前端开发服务器
cd frontend-vue
npm install
npm run dev

# 后端（另开终端）
cd backend
npm install
npm start
```

前端开发服务器：http://localhost:5173

## 本地自动部署配置

### 1. 启动 Webhook 服务

```bash
node webhook-server.js
```

### 2. 启动内网穿透

```bash
# 使用 Cloudflare Tunnel
cloudflared tunnel --url http://localhost:4000
```

获取公网地址，如：`https://xxx.trycloudflare.com`

### 3. 配置 GitHub Secrets

访问：https://github.com/jiangbkvir/github-deploy-demo/settings/secrets/actions

| 名称 | 值 |
|------|-----|
| `WEBHOOK_URL` | 你的 Cloudflare Tunnel 地址 |
| `WEBHOOK_SECRET` | `my-secret-key` |

### 4. 测试自动部署

```bash
git add .
git commit -m "test: auto deploy"
git push
```

## API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/` | GET | 前端页面（Vue SPA） |
| `/about` | GET | 关于页面 |
| `/api` | GET | 获取后端数据 |
| `/health` | GET | 健康检查 |

## API 响应示例

```json
{
  "success": true,
  "message": "🎉 欢迎使用 GitHub Actions 自动部署！Vue 3 + TypeScript 版本",
  "timestamp": "2025/12/23 16:59:17",
  "environment": "production",
  "version": "3.0.0",
  "author": "jiangbkvir",
  "features": [
    "Vue 3",
    "TypeScript",
    "Vue Router",
    "Pinia",
    "Vite",
    "Docker 容器化",
    "GitHub Actions CI/CD"
  ]
}
```

## 学习要点

### Docker 多阶段构建
- 前端构建阶段：使用 Node.js 构建 Vue 应用
- 后端运行阶段：复制构建产物，运行 Express 服务
- 镜像优化：最终镜像只包含运行时文件

### GitHub Actions CI/CD
- 自动构建测试：每次推送验证 Docker 镜像构建
- Webhook 触发：构建成功后自动通知本地部署

### Vue 3 最佳实践
- **Composition API**：`<script setup>` 语法
- **TypeScript**：完整类型支持
- **路由管理**：Vue Router 4
- **状态管理**：Pinia（Vuex 继任者）

## 扩展建议

- [ ] 添加单元测试（Vitest）
- [ ] 添加 E2E 测试（Playwright）
- [ ] 添加数据库（PostgreSQL + Prisma）
- [ ] 配置 Nginx 反向代理
- [ ] 添加 HTTPS 证书
- [ ] 配置环境变量管理（dotenv）

## 常见问题

**Q: 如何修改端口？**
A: 修改 `docker-compose.yml` 中的端口映射，如 `8080:3000`

**Q: Cloudflare Tunnel 地址变了怎么办？**
A: 更新 GitHub Secret 中的 `WEBHOOK_URL`

**Q: 本地开发时前端如何调用后端 API？**
A: Vite 已配置代理，`/api` 请求会自动转发到 `http://localhost:3000`

## 相关文档

- [Vue 3 文档](https://vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Vite 文档](https://vitejs.dev/)
- [Vue Router 文档](https://router.vuejs.org/)
- [Pinia 文档](https://pinia.vuejs.org/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

## 许可证

MIT

## 作者

[jiangbkvir](https://github.com/jiangbkvir)
