<template>
  <div class="about">
    <div class="container">
      <div class="card">
        <h2>关于项目</h2>
        <p>这是一个完整的 GitHub Actions 自动部署示例项目</p>

        <div class="tech-stack">
          <h3>技术栈</h3>
          <div class="stack-grid">
            <div class="stack-item">
              <h4>前端</h4>
              <ul>
                <li>Vue 3</li>
                <li>TypeScript</li>
                <li>Vite</li>
                <li>Vue Router</li>
                <li>Pinia</li>
              </ul>
            </div>
            <div class="stack-item">
              <h4>后端</h4>
              <ul>
                <li>Node.js</li>
                <li>Express</li>
              </ul>
            </div>
            <div class="stack-item">
              <h4>部署</h4>
              <ul>
                <li>Docker</li>
                <li>GitHub Actions</li>
                <li>Cloudflare Tunnel</li>
                <li>Webhook</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="features">
          <h3>特性</h3>
          <ul>
            <li>✅ 代码推送到 GitHub 自动触发构建</li>
            <li>✅ GitHub Actions 运行 Docker 镜像测试</li>
            <li>✅ 通过 Webhook 触发本地自动部署</li>
            <li>✅ 本地自动拉取代码并重建容器</li>
            <li>✅ 完整的前后端分离架构</li>
          </ul>
        </div>

        <div class="author">
          <p>作者: <strong>jiangbkvir</strong></p>
          <p>GitHub: <a href="https://github.com/jiangbkvir/github-deploy-demo" target="_blank">github-deploy-demo</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// About page component
</script>

<style scoped>
.about {
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
}

.container {
  width: 100%;
  max-width: 800px;
}

.card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 2rem;
}

.card h2 {
  margin-top: 0;
  color: #333;
  font-size: 1.75rem;
}

.tech-stack,
.features {
  margin: 2rem 0;
}

.tech-stack h3,
.features h3 {
  color: #495057;
  margin-bottom: 1rem;
}

.stack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stack-item {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 10px;
}

.stack-item h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #667eea;
}

.stack-item ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.stack-item li {
  padding: 0.25rem 0;
  color: #495057;
}

.features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features li {
  padding: 0.75rem 0;
  color: #495057;
  border-bottom: 1px solid #e9ecef;
}

.features li:last-child {
  border-bottom: none;
}

.author {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;
  text-align: center;
  color: #6c757d;
}

.author a {
  color: #667eea;
  text-decoration: none;
}

.author a:hover {
  text-decoration: underline;
}
</style>
